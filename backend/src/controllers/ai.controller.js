import { aiService, auditLogService } from '../services/index.js';
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
    adminNotesDraft: `Workload type: ${decision.workloadType}. Estimated VRAM need: ${decision.requiredVramGb}GB. Follow up to confirm runtime, framework, and availability before approval.`,
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
