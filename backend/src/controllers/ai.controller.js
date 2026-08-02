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
