export const blogCategories = [
  'AI Infrastructure',
  'GPU Strategy',
  'Model Operations',
  'Security',
  'Research',
];

export const blogPosts = [
  {
    id: 'blog-001',
    slug: 'gpu-orchestration-for-agentic-ai',
    title: 'GPU Orchestration for Agentic AI Systems',
    excerpt:
      'How modern teams plan elastic GPU capacity for agents, evaluation loops, and multimodal inference.',
    category: 'AI Infrastructure',
    status: 'published',
    author: 'iTernityverse Research',
    publishedAt: '2026-07-24',
    updatedAt: '2026-07-28',
    heroTone: 'teal',
    tags: ['Agents', 'Inference', 'Capacity Planning'],
    metrics: {
      views: '18.4K',
      engagement: '74%',
      leads: 42,
    },
    body: [
      {
        heading: 'Why orchestration matters',
        copy:
          'Agentic systems can move from low-cost reasoning to bursty GPU-heavy execution in seconds. A useful GPU strategy starts with knowing which workloads need reserved capacity and which can run on elastic queues.',
      },
      {
        heading: 'Design around workload phases',
        copy:
          'Separate experimentation, evaluation, batch generation, and production inference. Each phase has different tolerance for latency, availability, and cost, so one generic pool rarely delivers the best operational result.',
      },
      {
        heading: 'The iTernityverse approach',
        copy:
          'We recommend matching GPU tiers to workload criticality, keeping observability close to the workspace, and reviewing utilization weekly so teams can rebalance before cost drift becomes invisible.',
      },
    ],
  },
  {
    id: 'blog-002',
    slug: 'secure-workspaces-for-ai-teams',
    title: 'Secure GPU Workspaces for High-Velocity AI Teams',
    excerpt:
      'A practical framework for access, secrets, auditability, and operational handoff in GPU-backed workspaces.',
    category: 'Security',
    status: 'published',
    author: 'Cloud Operations',
    publishedAt: '2026-07-18',
    updatedAt: '2026-07-21',
    heroTone: 'green',
    tags: ['Security', 'Workspace', 'Credentials'],
    metrics: {
      views: '12.9K',
      engagement: '69%',
      leads: 31,
    },
    body: [
      {
        heading: 'Start with least privilege',
        copy:
          'Workspace credentials should be scoped to the job, not the person. This makes rotation, expiry, and incident response easier when teams move quickly.',
      },
      {
        heading: 'Make audit logs useful',
        copy:
          'Audit trails should answer who changed access, which workspace was affected, and what operational state changed. Dense logs are not enough if teams cannot read them during pressure.',
      },
      {
        heading: 'Reduce handoff risk',
        copy:
          'Treat workspace delivery as a lifecycle. Approval, provisioning, credential delivery, expiry, and teardown should each leave a clear state transition.',
      },
    ],
  },
  {
    id: 'blog-003',
    slug: 'choosing-gpus-for-multimodal-models',
    title: 'Choosing GPUs for Multimodal Model Pipelines',
    excerpt:
      'A selection guide for image, video, speech, and fused multimodal workloads across budget tiers.',
    category: 'GPU Strategy',
    status: 'published',
    author: 'Marketplace Team',
    publishedAt: '2026-07-10',
    updatedAt: '2026-07-14',
    heroTone: 'blue',
    tags: ['Multimodal', 'Training', 'VRAM'],
    metrics: {
      views: '21.7K',
      engagement: '81%',
      leads: 58,
    },
    body: [
      {
        heading: 'VRAM is the first constraint',
        copy:
          'Multimodal workloads often fail first on memory pressure. Model size, context length, frame count, and batch shape all push VRAM demand before compute becomes the bottleneck.',
      },
      {
        heading: 'Match the GPU to the pipeline',
        copy:
          'Training, fine-tuning, batch rendering, and real-time inference each reward different GPU characteristics. Avoid selecting purely by headline benchmark.',
      },
      {
        heading: 'Plan for iteration',
        copy:
          'Teams move faster when they can shift tiers as the experiment matures. Start with enough headroom to learn, then right-size when the workload stabilizes.',
      },
    ],
  },
  {
    id: 'blog-004',
    slug: 'evaluation-loops-before-production',
    title: 'Evaluation Loops Before Production AI Launches',
    excerpt:
      'How to structure eval workloads so product teams catch regressions before users do.',
    category: 'Model Operations',
    status: 'draft',
    author: 'Applied AI Lab',
    publishedAt: '',
    updatedAt: '2026-07-30',
    heroTone: 'violet',
    tags: ['Evaluation', 'Release', 'Quality'],
    metrics: {
      views: 'Preview',
      engagement: 'Draft',
      leads: 0,
    },
    body: [
      {
        heading: 'Treat evals as infrastructure',
        copy:
          'Evaluation jobs deserve repeatable environments, stable datasets, and clear ownership. A spreadsheet of spot checks is not enough for product release confidence.',
      },
      {
        heading: 'Measure behavior, not vibes',
        copy:
          'The strongest eval plans combine automated scoring, human review, and production traces so teams understand both accuracy and user impact.',
      },
    ],
  },
];

export const getPublishedBlogPosts = () =>
  blogPosts.filter((post) => post.status === 'published');

export const getBlogPostBySlug = (slug, includeDrafts = false) =>
  blogPosts.find((post) => post.slug === slug && (includeDrafts || post.status === 'published'));
