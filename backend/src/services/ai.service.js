import { config } from '../config/index.js';
import { ApiError } from '../utils/api-error.js';

const MAX_PROMPT_CHARS = 9000;

const stripCodeFence = (value = '') =>
  value
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

const parseJsonObject = (value) => {
  const cleaned = stripCodeFence(value);

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');

    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }

    throw new ApiError(502, 'AI response was not valid JSON.');
  }
};

const cleanString = (value, fallback = '') =>
  String(value || fallback)
    .replace(/\s+/g, ' ')
    .trim();

const cleanTags = (tags) =>
  (Array.isArray(tags) ? tags : [])
    .map((tag) =>
      String(tag || '')
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40)
    )
    .filter(Boolean)
    .slice(0, 8);

const clamp = (value, maxLength) => cleanString(value).slice(0, maxLength).trim();

class AiService {
  isConfigured() {
    return Boolean(config.ai.apiKey);
  }

  async completeJson({ system, user, temperature = 0.35 }) {
    if (!this.isConfigured()) {
      return null;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.ai.timeoutMs);

    try {
      const response = await fetch(`${config.ai.baseUrl.replace(/\/$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.ai.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: config.ai.model,
          temperature,
          max_completion_tokens: config.ai.maxOutputTokens,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user.slice(0, MAX_PROMPT_CHARS) },
          ],
        }),
      });

      if (!response.ok) {
        throw new ApiError(response.status >= 500 ? 502 : 400, 'AI provider request failed.');
      }

      const payload = await response.json();
      const content = payload?.choices?.[0]?.message?.content;

      if (!content) {
        throw new ApiError(502, 'AI provider returned an empty response.');
      }

      return parseJsonObject(content);
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new ApiError(504, 'AI provider request timed out.');
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  async generateBlogMetadata({ title, category, excerpt, body, imageUrl }) {
    const bodyText = (Array.isArray(body) ? body : [])
      .map((section) => `${section.heading}\n${section.copy}`)
      .join('\n\n');

    const result = await this.completeJson({
      system:
        'You are an SEO editor for a GPU cloud marketplace. Return only compact JSON with: excerpt, seoTitle, seoDescription, imageAlt, tags, faqs. faqs must be an array of up to 4 objects with question and answer. Avoid keyword stuffing. Keep claims conservative.',
      user: JSON.stringify({
        title,
        category,
        excerpt,
        body: bodyText,
        imageUrl,
        constraints: {
          excerpt: '120-180 characters',
          seoTitle: '45-60 characters',
          seoDescription: '130-155 characters',
          imageAlt: 'descriptive, under 120 characters',
          tags: '3-8 short lowercase tags',
        },
      }),
    });

    if (!result) {
      return null;
    }

    return {
      excerpt: clamp(result.excerpt || excerpt, 500),
      seoTitle: clamp(result.seoTitle || title, 180),
      seoDescription: clamp(result.seoDescription || excerpt, 300),
      imageAlt: clamp(result.imageAlt || title, 180),
      tags: cleanTags(result.tags),
      faqs: (Array.isArray(result.faqs) ? result.faqs : [])
        .map((faq) => ({
          question: clamp(faq.question, 180),
          answer: clamp(faq.answer, 500),
        }))
        .filter((faq) => faq.question && faq.answer)
        .slice(0, 4),
      provider: config.ai.provider,
      model: config.ai.model,
    };
  }

  async analyzeEnquiry({ projectDescription, expectedUsage, duration, budget, gpuPackage }) {
    const result = await this.completeJson({
      system:
        'You are an operations assistant for a GPU rental marketplace. Return only compact JSON with: summary, workloadType, fitRationale, suggestedPackage, risks, clarificationQuestions, adminNotesDraft, customerReplyDraft. Do not include private contact info. Keep tone professional and conservative. Do not provide numeric scores or status decisions.',
      user: JSON.stringify({
        enquiry: {
          projectDescription,
          expectedUsage,
          duration,
          budget,
        },
        selectedGpuPackage: gpuPackage,
        constraints: {
          risks: 'up to 5 short strings',
          clarificationQuestions: 'up to 5 short strings',
          adminNotesDraft: 'under 900 characters',
          customerReplyDraft: 'under 1200 characters',
        },
      }),
      temperature: 0,
    });

    if (!result) {
      return null;
    }

    return {
      summary: clamp(result.summary, 700),
      workloadType: clamp(result.workloadType, 80),
      fitRationale: clamp(result.fitRationale, 900),
      suggestedPackage: clamp(result.suggestedPackage, 220),
      risks: (Array.isArray(result.risks) ? result.risks : []).map((item) => clamp(item, 160)).filter(Boolean).slice(0, 5),
      clarificationQuestions: (Array.isArray(result.clarificationQuestions) ? result.clarificationQuestions : [])
        .map((item) => clamp(item, 180))
        .filter(Boolean)
        .slice(0, 5),
      adminNotesDraft: clamp(result.adminNotesDraft, 1200),
      customerReplyDraft: clamp(result.customerReplyDraft, 1500),
      provider: config.ai.provider,
      model: config.ai.model,
    };
  }

  async generateGpuPackageCopy(gpuPackage) {
    const result = await this.completeJson({
      system:
        'You are a product copy assistant for a GPU cloud marketplace. Return only compact JSON with: description, features, useCases, seoTitle, seoDescription, faqs. Be accurate to the provided specs. Do not invent benchmark numbers or unsupported guarantees.',
      user: JSON.stringify({
        gpuPackage,
        constraints: {
          description: '2 concise paragraphs under 900 characters total',
          features: '5 to 7 short feature strings',
          useCases: '4 to 6 practical workload strings',
          seoTitle: '45-60 characters',
          seoDescription: '130-155 characters',
          faqs: 'up to 4 question/answer objects',
        },
      }),
    });

    if (!result) {
      return null;
    }

    return {
      description: clamp(result.description, 1200),
      features: (Array.isArray(result.features) ? result.features : []).map((item) => clamp(item, 120)).filter(Boolean).slice(0, 7),
      useCases: (Array.isArray(result.useCases) ? result.useCases : []).map((item) => clamp(item, 120)).filter(Boolean).slice(0, 6),
      seoTitle: clamp(result.seoTitle, 180),
      seoDescription: clamp(result.seoDescription, 300),
      faqs: (Array.isArray(result.faqs) ? result.faqs : [])
        .map((faq) => ({
          question: clamp(faq.question, 180),
          answer: clamp(faq.answer, 500),
        }))
        .filter((faq) => faq.question && faq.answer)
        .slice(0, 4),
      provider: config.ai.provider,
      model: config.ai.model,
    };
  }
}

export const aiService = new AiService();
