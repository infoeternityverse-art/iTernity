import { aiService, auditLogService, gpuPackageService } from '../services/index.js';
import { config } from '../config/index.js';
import { asyncHandler } from '../utils/async-handler.js';
import { sendSuccess } from '../utils/api-response.js';

const generateFallbackMetadata = ({ title, category, excerpt, body = [], imageUrl }) => {
  const bodyText = body.map((section) => `${section.heading}. ${section.copy}`).join(' ');
  const source = `${title} ${category} ${excerpt || ''} ${bodyText}`.toLowerCase();
  const tags = ['gpu', 'ai', 'cloud', 'inference', 'rendering', 'training', 'compute', 'rental']
    .filter((tag) => source.includes(tag))
    .slice(0, 6);
  const summary = excerpt || bodyText.replace(/\s+/g, ' ').trim().slice(0, 155);

  return {
    excerpt: summary || title,
    seoTitle: title.slice(0, 60),
    seoDescription: (summary || `${title} from the ${category} category.`).slice(0, 155),
    imageAlt: imageUrl ? `${title} blog image` : title,
    tags,
    faqs: [],
    provider: 'local-fallback',
    model: 'rule-based',
  };
};

const normalizeBudgetFit = (budget, hourlyPrice) => {
  if (!budget || !hourlyPrice) return 'Budget fit needs confirmation.';
  return budget >= hourlyPrice * 8
    ? 'Budget appears workable for an initial session.'
    : 'Budget may be tight depending on expected runtime.';
};

const clampNumber = (value, min, max) => Math.min(max, Math.max(min, value));

const detectWorkloadType = (projectDescription = '', expectedUsage = '') => {
  const source = `${projectDescription} ${expectedUsage}`.toLowerCase();

  if (source.includes('fine-tun') || source.includes('lora') || source.includes('train')) {
    return 'training or fine-tuning';
  }

  if (source.includes('comfy') || source.includes('stable diffusion') || source.includes('sdxl')) {
    return 'image generation';
  }

  if (source.includes('video') || source.includes('render') || source.includes('blender')) {
    return 'rendering or media generation';
  }

  if (source.includes('inference') || source.includes('llm') || source.includes('llama')) {
    return 'AI inference';
  }

  return 'general GPU workload';
};

const estimateRequiredVram = (projectDescription = '', expectedUsage = '') => {
  const source = `${projectDescription} ${expectedUsage}`.toLowerCase();

  if (source.includes('70b') || source.includes('large model') || source.includes('multi-gpu')) return 48;
  if (source.includes('fine-tun') || source.includes('lora') || source.includes('train')) return 24;
  if (source.includes('video') || source.includes('sdxl') || source.includes('comfy')) return 16;
  if (source.includes('llm') || source.includes('inference') || source.includes('render')) return 16;
  return 12;
};

const calculateFitDecision = ({ projectDescription, expectedUsage, budget, gpuPackage = {} }) => {
  const requiredVram = estimateRequiredVram(projectDescription, expectedUsage);
  const availableVram = Number(gpuPackage.gpuMemoryGb || 0);
  const cpuCores = Number(gpuPackage.cpuCores || 0);
  const ramGb = Number(gpuPackage.ramGb || 0);
  const hourlyPrice = Number(gpuPackage.hourlyPrice || 0);
  const budgetValue = Number(budget || 0);
  let score = 50;

  if (availableVram >= requiredVram * 1.5) score += 30;
  else if (availableVram >= requiredVram) score += 22;
  else if (availableVram >= requiredVram * 0.75) score += 8;
  else if (availableVram > 0) score -= 18;

  if (cpuCores >= 16) score += 6;
  else if (cpuCores > 0 && cpuCores < 8) score -= 4;

  if (ramGb >= 64) score += 6;
  else if (ramGb > 0 && ramGb < 32) score -= 4;

  if (gpuPackage.availabilityStatus === 'unavailable') score -= 25;
  if (gpuPackage.availabilityStatus === 'limited') score -= 6;
  if (gpuPackage.availabilityStatus === 'coming_soon') score -= 12;

  if (budgetValue && hourlyPrice) {
    const estimatedHours = budgetValue / hourlyPrice;
    if (estimatedHours >= 40) score += 8;
    else if (estimatedHours >= 8) score += 4;
    else if (estimatedHours < 2) score -= 12;
  }

  const fitScore = Math.round(clampNumber(score, 5, 95));
  const source = `${projectDescription} ${expectedUsage || ''}`.toLowerCase();
  const hasUrgency = ['urgent', 'asap', 'production', 'deadline'].some((word) => source.includes(word));
  const priority = hasUrgency || budgetValue >= 1000 ? 'high' : budgetValue ? 'medium' : 'low';
  const recommendedStatus =
    fitScore >= 70 && gpuPackage.availabilityStatus !== 'unavailable' ? 'contacted' : 'pending';

  return {
    fitScore,
    priority,
    recommendedStatus,
    workloadType: detectWorkloadType(projectDescription, expectedUsage),
    requiredVramGb: requiredVram,
  };
};

const generateFallbackEnquiryAnalysis = ({ projectDescription, expectedUsage, duration, budget, gpuPackage = {} }) => {
  const decision = calculateFitDecision({ projectDescription, expectedUsage, budget, gpuPackage });

  return {
    summary: projectDescription.slice(0, 650),
    workloadType: decision.workloadType,
    priority: decision.priority,
    fitScore: decision.fitScore,
    recommendedStatus: decision.recommendedStatus,
    requiredVramGb: decision.requiredVramGb,
    fitRationale: `${gpuPackage.name || gpuPackage.gpuModel || 'The selected package'} may fit, but runtime, framework, and memory requirements should be confirmed. ${normalizeBudgetFit(budget, gpuPackage.hourlyPrice)}`,
    suggestedPackage: gpuPackage.name || gpuPackage.gpuModel || 'Confirm package after workload details.',
    risks: ['Exact VRAM and runtime requirements are not fully confirmed.'],
    clarificationQuestions: [
      'Which framework or application will run on the GPU?',
      'What model size, batch size, or render workload do you expect?',
      'How many hours or days of access are needed?',
    ],
    adminNotesDraft: `Workload type: ${decision.workloadType}. Estimated VRAM need: ${decision.requiredVramGb}GB. Requested duration: ${duration || 'not specified'}. Follow up to confirm runtime, framework, and availability before approval.`,
    customerReplyDraft:
      'Thanks for sharing your workload. We are reviewing the selected GPU package for fit and availability. Could you confirm your framework/application, expected runtime, and memory requirements?',
    provider: 'local-fallback',
    model: 'rule-based',
  };
};

const generateFallbackGpuCopy = (gpuPackage) => ({
  description: `${gpuPackage.name} is configured for practical GPU cloud workloads using ${gpuPackage.gpuModel} with ${gpuPackage.gpuMemoryGb}GB VRAM, ${gpuPackage.cpuCores} CPU cores, ${gpuPackage.ramGb}GB RAM, and ${gpuPackage.storageGb}GB ${gpuPackage.storageType || 'nvme'} storage. It is a good fit for teams that need clear specs, reviewed access, and predictable rental planning.`,
  features: [
    `${gpuPackage.gpuModel} with ${gpuPackage.gpuMemoryGb}GB VRAM`,
    `${gpuPackage.cpuCores} CPU cores and ${gpuPackage.ramGb}GB RAM`,
    `${gpuPackage.storageGb}GB ${gpuPackage.storageType || 'nvme'} storage`,
    `Region: ${gpuPackage.region}`,
    `Pricing from ${gpuPackage.currency || 'USD'} ${gpuPackage.hourlyPrice}/hr`,
  ],
  useCases: ['AI inference', 'Model experimentation', 'Batch rendering', 'Research workloads'],
  seoTitle: `${gpuPackage.gpuModel} GPU Rental`,
  seoDescription: `Rent ${gpuPackage.gpuModel} GPU capacity with ${gpuPackage.gpuMemoryGb}GB VRAM for AI, rendering, and research workloads.`,
  faqs: [],
  provider: 'local-fallback',
  model: 'rule-based',
});

const serializePackage = (gpuPackage) => ({
  id: String(gpuPackage._id || gpuPackage.id),
  name: gpuPackage.name,
  gpuModel: gpuPackage.gpuModel,
  gpuMemoryGb: gpuPackage.gpuMemoryGb,
  cpuCores: gpuPackage.cpuCores,
  ramGb: gpuPackage.ramGb,
  storageGb: gpuPackage.storageGb,
  storageType: gpuPackage.storageType,
  bandwidth: gpuPackage.bandwidth,
  region: gpuPackage.region,
  hourlyPrice: gpuPackage.hourlyPrice,
  monthlyPrice: gpuPackage.monthlyPrice,
  currency: gpuPackage.currency,
  availabilityStatus: gpuPackage.availabilityStatus,
  description: gpuPackage.description,
  features: gpuPackage.features,
  useCases: gpuPackage.useCases,
});

const scorePackageForWorkload = ({ gpuPackage, workload, budget }) => {
  const requiredVram = estimateRequiredVram(workload, '');
  const availableVram = Number(gpuPackage.gpuMemoryGb || 0);
  const cpuCores = Number(gpuPackage.cpuCores || 0);
  const ramGb = Number(gpuPackage.ramGb || 0);
  const hourlyPrice = Number(gpuPackage.hourlyPrice || 0);
  const budgetValue = Number(budget || 0);
  const source = workload.toLowerCase();
  let score = 50;

  if (availableVram >= requiredVram * 1.5) score += 30;
  else if (availableVram >= requiredVram) score += 22;
  else if (availableVram >= requiredVram * 0.75) score += 8;
  else score -= 20;

  if (cpuCores >= 16) score += 6;
  if (ramGb >= 64) score += 6;
  if (gpuPackage.availabilityStatus === 'available') score += 8;
  if (gpuPackage.availabilityStatus === 'limited') score -= 4;
  if (gpuPackage.availabilityStatus === 'coming_soon') score -= 10;

  if (budgetValue && hourlyPrice) {
    const estimatedHours = budgetValue / hourlyPrice;
    if (estimatedHours >= 40) score += 8;
    else if (estimatedHours >= 8) score += 4;
    else if (estimatedHours < 2) score -= 18;
  }

  if (source.includes('budget') || source.includes('cheap') || source.includes('low cost')) {
    score -= Math.min(18, hourlyPrice);
  }

  return Math.round(clampNumber(score, 5, 98));
};

const generateFallbackRecommendationText = ({ workload, duration, budget, recommendation }) => ({
  explanation: `${recommendation.name} is the strongest match from current published packages based on estimated VRAM need, availability, and budget fit. Confirm framework, model size, and expected runtime before final approval.`,
  suggestedEnquiryText: `I want to use ${recommendation.name} for: ${workload}${duration ? ` Duration: ${duration}.` : ''}${budget ? ` Budget: ${budget}.` : ''}`,
  clarificationQuestions: [
    'Which framework or application will you run?',
    'What model size, batch size, or render workload do you expect?',
    'How long do you need access for the first run?',
  ],
  provider: 'local-fallback',
  model: 'rule-based',
});

const ACTIONS_BY_ROLE = {
  guest: [
    { label: 'View GPU Marketplace', href: '/gpus' },
    { label: 'Request GPU Access', href: '/enquiry' },
    { label: 'Read FAQ', href: '/faq' },
    { label: 'Contact Team', href: '/contact' },
    { label: 'Login', href: '/login' },
    { label: 'Open Dashboard', href: '/dashboard' },
  ],
  customer: [
    { label: 'Open Dashboard', href: '/dashboard' },
    { label: 'My Enquiries', href: '/dashboard/enquiries' },
    { label: 'Workspace Access', href: '/dashboard/workspace' },
    { label: 'Credentials', href: '/dashboard/credentials' },
    { label: 'Profile', href: '/dashboard/profile' },
    { label: 'Contact Team', href: '/contact' },
  ],
  admin: [
    { label: 'Admin Overview', href: '/admin' },
    { label: 'Review Enquiries', href: '/admin/enquiries' },
    { label: 'Manage GPU Packages', href: '/admin/gpu-packages' },
    { label: 'Manage Blog SEO', href: '/admin/blog' },
    { label: 'Workspace Console', href: '/admin/workspaces' },
    { label: 'Contact Team', href: '/contact' },
  ],
};

const uniqueActions = (actions = []) => {
  const seen = new Set();

  return actions.filter((action) => {
    if (seen.has(action.href)) return false;
    seen.add(action.href);
    return true;
  });
};

const getAssistantActions = ({ role = 'guest', path = '' }) => {
  const baseActions = ACTIONS_BY_ROLE[role] || ACTIONS_BY_ROLE.guest;

  if (path.startsWith('/gpus')) {
    return uniqueActions([
      { label: 'Use GPU Recommender', href: '/gpus' },
      { label: 'Request Selected GPU', href: '/enquiry' },
      ...baseActions,
    ]).slice(0, 7);
  }

  if (path.startsWith('/admin/enquiries')) {
    return uniqueActions([
      { label: 'Review Enquiries', href: '/admin/enquiries' },
      { label: 'Manage GPU Packages', href: '/admin/gpu-packages' },
      ...baseActions,
    ]).slice(0, 7);
  }

  if (path.startsWith('/admin/blog')) {
    return uniqueActions([
      { label: 'Manage Blog SEO', href: '/admin/blog' },
      { label: 'Create Blog Post', href: '/admin/blog/new' },
      ...baseActions,
    ]).slice(0, 7);
  }

  return baseActions;
};

const filterAssistantActions = (actions = [], allowedActions = []) => {
  const allowedHrefs = new Set(allowedActions.map((action) => action.href));
  const seenHrefs = new Set();

  return actions
    .filter((action) => allowedHrefs.has(action.href))
    .map((action) => allowedActions.find((allowedAction) => allowedAction.href === action.href))
    .filter(Boolean)
    .filter((action) => {
      if (seenHrefs.has(action.href)) return false;
      seenHrefs.add(action.href);
      return true;
    })
    .slice(0, 3);
};

const generateFallbackAssistantAnswer = ({ message, context, actions }) => {
  const source = message.toLowerCase();
  const role = context?.role || 'guest';
  let answer =
    'I can help you choose a GPU, prepare a strong enquiry, find the right page, or explain the current workflow. Tell me your workload, budget, timeline, or what you are trying to manage.';
  let selectedActions = actions.slice(0, 3);
  let intent = 'general-help';

  if (source.includes('gpu') || source.includes('model') || source.includes('training') || source.includes('render')) {
    answer =
      'Share your workload, model size or software, expected runtime, and budget. I can help you shortlist a GPU and turn that into a clear enquiry for the team.';
    selectedActions = actions.filter((action) => ['/gpus', '/enquiry'].includes(action.href)).slice(0, 2);
    intent = 'gpu-guidance';
  } else if (source.includes('enquiry') || source.includes('request')) {
    answer =
      'For a strong enquiry, include the workload, framework, model size, dataset or render size, required duration, budget, and whether the access is urgent.';
    selectedActions = actions.filter((action) => action.href.includes('enquir') || action.href === '/enquiry').slice(0, 2);
    intent = 'enquiry-help';
  } else if (role === 'admin' && (source.includes('blog') || source.includes('seo'))) {
    answer =
      'For admin SEO work, generate metadata after the title, category, hero image, and body are mostly ready. Then review the title, description, image alt text, tags, and FAQs before publishing.';
    selectedActions = actions.filter((action) => action.href.includes('blog')).slice(0, 2);
    intent = 'admin-seo';
  } else if (role === 'admin') {
    answer =
      'I can help you review enquiries, prepare customer replies, improve package copy, and move through the admin console without exposing private credentials.';
    selectedActions = actions.slice(0, 3);
    intent = 'admin-workflow';
  } else if (role === 'customer') {
    answer =
      'I can help you track your GPU request, understand workspace access, and prepare the details the team needs before provisioning.';
    selectedActions = actions.slice(0, 3);
    intent = 'customer-workflow';
  }

  return {
    answer,
    intent,
    actions: selectedActions,
    provider: 'local-fallback',
    model: 'rule-based',
  };
};

const pickActions = (actions, hrefs) =>
  hrefs
    .map((href) => actions.find((action) => action.href === href))
    .filter(Boolean)
    .slice(0, 3);

const getConversationText = (history = []) =>
  history
    .map((item) => `${item.role}: ${item.content}`)
    .join(' ')
    .toLowerCase();

const hasEmailAddress = (value = '') => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);

const normalizeAssistantText = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/\bcocern\b/g, 'concern')
    .replace(/\bconsern\b/g, 'concern')
    .replace(/\btakke\b/g, 'take')
    .replace(/\bticket\b/g, 'ticket')
    .replace(/\bprob\b/g, 'problem')
    .replace(/\s+/g, ' ')
    .trim();

const redactSensitiveText = (value = '') =>
  String(value)
    .replace(/[^\s@]+@[^\s@]+\.[^\s@]+/g, '[email]')
    .replace(/\+?\d[\d\s().-]{7,}\d/g, '[phone]');

const redactAssistantHistory = (history = []) =>
  history.map((item) => ({
    role: item.role,
    content: redactSensitiveText(item.content),
  }));

const generateWorkflowAssistantAnswer = ({ message, context, history = [], actions }) => {
  const source = normalizeAssistantText(message);
  const conversation = normalizeAssistantText(`${getConversationText(history)} ${source}`);
  const role = context?.role || 'guest';
  const hasAny = (terms) => terms.some((term) => source.includes(term));
  const threadHasAny = (terms) => terms.some((term) => conversation.includes(term));
  const previousIntentIsSupport = threadHasAny([
    'credential',
    'access',
    'support',
    'contact',
    'concern',
    'ticket',
    'problem',
    'not able',
    'cannot',
    "can't",
  ]);
  const supportEmail = config.supportEmail;

  if (
    hasAny([
      'take my concern',
      'take concern',
      'take my enquiry',
      'raise concern',
      'raise my concern',
      'raise my problem',
      'raise problem',
      'submit concern',
      'create ticket',
      'raise a ticket',
      'support ticket',
      'ticket',
    ]) ||
    (hasEmailAddress(source) && threadHasAny(['credential', 'access', 'support', 'contact', 'concern']))
  ) {
    return {
      answer: `I can prepare the support note for you, but this chat cannot submit a ticket yet. Send this from the Contact page or email ${supportEmail}: "My GPU access or credentials are not available. Registered email: [your email]. Enquiry ID: [if available]. GPU/package: [name]. Issue: I need the team to verify provisioning and credentials." If you cannot open the Contact page, email ${supportEmail} directly.`,
      intent: 'support-intake',
      actions: pickActions(actions, ['/contact', '/dashboard/enquiries', '/dashboard/workspace', '/login']),
      provider: 'local-workflow',
      model: 'rule-based',
    };
  }

  if (
    previousIntentIsSupport &&
    hasAny(['i cant', "i can't", 'cant', "can't", 'cannot', 'not able', 'unable', 'not working', 'no'])
  ) {
    return {
      answer: `No problem. If the Contact page or form is not working, email ${supportEmail} directly. Use subject: "GPU access credentials issue". Include your registered email, enquiry ID if available, GPU/package name, and one screenshot or exact error text. Do not send passwords or private keys.`,
      intent: 'support-blocked',
      actions: pickActions(actions, ['/contact', '/login', '/dashboard']),
      provider: 'local-workflow',
      model: 'rule-based',
    };
  }

  if (hasAny(['credential', 'password', 'ssh', 'login detail', 'access detail'])) {
    return {
      answer:
        role === 'customer'
          ? `Credentials appear only after your workspace is provisioned. Open Workspace Access and Credentials. If they are empty, your enquiry may still be under review or the admin has not attached credentials yet. Contact the team at ${supportEmail} with your enquiry ID. Do not share passwords in chat.`
          : `GPU credentials are not generated from the public assistant. First log in and check your dashboard workspace. If approved access exists but credentials are missing, contact ${supportEmail} with your enquiry ID so the team can verify provisioning.`,
      intent: 'credentials-help',
      actions: pickActions(actions, ['/dashboard/workspace', '/dashboard/credentials', '/dashboard', '/login', '/contact']),
      provider: 'local-workflow',
      model: 'rule-based',
    };
  }

  if (
    hasAny([
      'already',
      'own',
      'owne',
      'have access',
      'not able to get',
      'cannot get',
      "can't get",
      'access missing',
      'gpu access',
    ])
  ) {
    return {
      answer:
        `If your GPU access is already approved but you cannot open it, check three things: you are logged into the same account used for the enquiry, the workspace page shows an active workspace, and credentials have been assigned. If any are missing, contact ${supportEmail} with your enquiry ID instead of submitting a duplicate request.`,
      intent: 'access-troubleshooting',
      actions: pickActions(actions, ['/dashboard/workspace', '/dashboard/enquiries', '/dashboard', '/login', '/contact']),
      provider: 'local-workflow',
      model: 'rule-based',
    };
  }

  if (
    hasAny([
      'form',
      'submit',
      'validation',
      'field',
      'not able to fill',
      'cannot fill',
      "can't fill",
      'cant fill',
    ])
  ) {
    return {
      answer:
        'For the enquiry form, fill the required contact details, select or confirm the GPU package if available, then describe your workload clearly. Include framework/software, model size or render type, duration, budget, and urgency. If submission fails, check required fields and use Contact Team with a screenshot or the exact error text.',
      intent: 'form-help',
      actions: pickActions(actions, ['/enquiry', '/gpus', '/contact']),
      provider: 'local-workflow',
      model: 'rule-based',
    };
  }

  if (hasAny(['email', 'mail', 'support', 'contact', 'call'])) {
    return {
      answer:
        `Use the Contact page or email ${supportEmail}. For faster help, include your name, registered email, enquiry ID if you have one, the GPU/package involved, and the exact issue you are seeing. Do not paste passwords, API keys, or private credentials into chat.`,
      intent: 'support-contact',
      actions: pickActions(actions, ['/contact', '/dashboard/enquiries', '/enquiry']),
      provider: 'local-workflow',
      model: 'rule-based',
    };
  }

  if (hasAny(['price', 'pricing', 'cost', 'budget', 'cheap', 'hour', 'monthly'])) {
    return {
      answer:
        'Pricing fit depends on the selected GPU hourly/monthly rate, your runtime, and whether the workload needs high VRAM. Open the GPU marketplace, compare hourly and monthly prices, then use the recommender with your workload and budget. I will not invent prices; use the live package cards as the source of truth.',
      intent: 'pricing-help',
      actions: pickActions(actions, ['/gpus', '/enquiry', '/faq']),
      provider: 'local-workflow',
      model: 'rule-based',
    };
  }

  if (hasAny(['choose', 'recommend', 'find', 'right gpu', 'which gpu', 'best gpu', 'training', 'inference', 'render', 'llm'])) {
    return {
      answer:
        'To choose the right GPU, start with VRAM need. Small inference or rendering can often start lower; fine-tuning, SDXL/video, and larger LLM work usually need more VRAM. Open the GPU marketplace and use the recommender with your model size, framework, duration, and budget so it can match against real published packages.',
      intent: 'gpu-selection',
      actions: pickActions(actions, ['/gpus', '/enquiry']),
      provider: 'local-workflow',
      model: 'rule-based',
    };
  }

  if (hasAny(['rental', 'rentals', 'how it work', 'how does it work', 'process', 'flow'])) {
    return {
      answer:
        'The rental flow is: compare GPU packages, submit an enquiry with workload details, admin reviews fit and availability, the team provisions an approved workspace, then credentials become available to the customer. If requirements are unclear, the team may ask follow-up questions before granting access.',
      intent: 'rental-flow',
      actions: pickActions(actions, ['/gpus', '/enquiry', '/faq']),
      provider: 'local-workflow',
      model: 'rule-based',
    };
  }

  return null;
};

export const generateBlogMetadata = asyncHandler(async (req, res) => {
  const aiMetadata = await aiService.generateBlogMetadata(req.validated.body);
  const metadata = aiMetadata || generateFallbackMetadata(req.validated.body);

  await auditLogService.record({
    actor: req.user._id,
    action: 'ai.blog_metadata.generated',
    entityType: 'BlogPost',
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    metadata: {
      provider: metadata.provider,
      model: metadata.model,
      configured: Boolean(aiMetadata),
    },
  });

  return sendSuccess(res, {
    message: aiMetadata
      ? 'Blog metadata generated successfully.'
      : 'Fallback blog metadata generated because AI is not configured.',
    data: metadata,
  });
});

export const analyzeEnquiry = asyncHandler(async (req, res) => {
  const aiAnalysis = await aiService.analyzeEnquiry(req.validated.body);
  const decision = calculateFitDecision(req.validated.body);
  const analysis = {
    ...(aiAnalysis || generateFallbackEnquiryAnalysis(req.validated.body)),
    workloadType: aiAnalysis?.workloadType || decision.workloadType,
    priority: decision.priority,
    fitScore: decision.fitScore,
    recommendedStatus: decision.recommendedStatus,
    requiredVramGb: decision.requiredVramGb,
  };

  await auditLogService.record({
    actor: req.user._id,
    action: 'ai.enquiry.analyzed',
    entityType: 'Enquiry',
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    metadata: {
      provider: analysis.provider,
      model: analysis.model,
      configured: Boolean(aiAnalysis),
    },
  });

  return sendSuccess(res, {
    message: aiAnalysis
      ? 'Enquiry analysis generated successfully.'
      : 'Fallback enquiry analysis generated because AI is not configured.',
    data: analysis,
  });
});

export const generateGpuPackageCopy = asyncHandler(async (req, res) => {
  const aiCopy = await aiService.generateGpuPackageCopy(req.validated.body);
  const copy = aiCopy || generateFallbackGpuCopy(req.validated.body);

  await auditLogService.record({
    actor: req.user._id,
    action: 'ai.gpu_package_copy.generated',
    entityType: 'GpuPackage',
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    metadata: {
      provider: copy.provider,
      model: copy.model,
      configured: Boolean(aiCopy),
    },
  });

  return sendSuccess(res, {
    message: aiCopy
      ? 'GPU package copy generated successfully.'
      : 'Fallback GPU package copy generated because AI is not configured.',
    data: copy,
  });
});

export const recommendGpuPackage = asyncHandler(async (req, res) => {
  const { workload, duration, budget } = req.validated.body;
  const response = await gpuPackageService.findPublished({
    limit: 50,
    sort: 'gpuMemoryGb',
    order: 'desc',
  });
  const packages = response.data.map(serializePackage);
  const rankedPackages = packages
    .map((gpuPackage) => ({
      gpuPackage,
      fitScore: scorePackageForWorkload({ gpuPackage, workload, budget }),
    }))
    .sort((first, second) => second.fitScore - first.fitScore);
  const best = rankedPackages[0];
  const alternatives = rankedPackages.slice(1, 3);

  if (!best) {
    return sendSuccess(res, {
      message: 'No published GPU packages are available for recommendation.',
      data: {
        recommendation: null,
        alternatives: [],
        explanation: 'No published GPU packages are currently available.',
        suggestedEnquiryText: '',
        clarificationQuestions: [],
        provider: 'local-fallback',
        model: 'rule-based',
      },
    });
  }

  const decision = {
    requiredVramGb: estimateRequiredVram(workload, ''),
    workloadType: detectWorkloadType(workload, ''),
    fitScore: best.fitScore,
  };
  const aiExplanation = await aiService.explainGpuRecommendation({
    workload,
    duration,
    budget,
    recommendation: best.gpuPackage,
    alternatives: alternatives.map((item) => item.gpuPackage),
  });
  const text = aiExplanation || generateFallbackRecommendationText({
    workload,
    duration,
    budget,
    recommendation: best.gpuPackage,
  });

  return sendSuccess(res, {
    message: aiExplanation
      ? 'GPU recommendation generated successfully.'
      : 'Fallback GPU recommendation generated because AI is not configured.',
    data: {
      recommendation: best.gpuPackage,
      alternatives: alternatives.map((item) => ({
        ...item.gpuPackage,
        fitScore: item.fitScore,
      })),
      ...decision,
      ...text,
    },
  });
});

export const answerSiteAssistant = asyncHandler(async (req, res) => {
  const { message, context = {}, history = [] } = req.validated.body;
  const safeContext = {
    path: context.path || '/',
    role: context.role || 'guest',
    pageTitle: context.pageTitle || '',
  };
  const allowedActions = getAssistantActions(safeContext);
  const workflowAnswer = generateWorkflowAssistantAnswer({
    message,
    context: safeContext,
    history,
    actions: allowedActions,
  });
  const redactedHistory = redactAssistantHistory(history);
  const aiAnswer =
    workflowAnswer ||
    (await aiService.answerSiteAssistant({
      message: redactSensitiveText(message),
      context: safeContext,
      history: redactedHistory,
      actions: allowedActions,
      supportEmail: config.supportEmail,
    }));
  const answer =
    aiAnswer ||
    generateFallbackAssistantAnswer({
      message,
      context: safeContext,
      actions: allowedActions,
    });

  return sendSuccess(res, {
    message: aiAnswer
      ? 'Assistant response generated successfully.'
      : 'Fallback assistant response generated because AI is not configured.',
    data: {
      ...answer,
      actions: filterAssistantActions(answer.actions, allowedActions),
    },
  });
});
