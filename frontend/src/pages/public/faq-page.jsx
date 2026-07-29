import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { PublicPageHero } from '@/components/common/public-page-hero.jsx';
import { cn, focusRing } from '@/components/ui/ui-utils.js';

const faqItems = [
  {
    value: 'approval',
    question: 'How does approval work?',
    answer:
      'Submit your workload requirements with a preferred GPU package. The operations team reviews fit, availability, duration, and project needs before approving access.',
  },
  {
    value: 'credentials',
    question: 'How do I receive credentials?',
    answer:
      'Credentials are issued manually by an administrator after approval. Approved customers can later access those details from their dashboard.',
  },
  {
    value: 'marketplace',
    question: 'Can I browse packages before creating an account?',
    answer:
      'Yes. The public marketplace is designed so visitors can compare GPU specs, pricing, region, and availability before submitting an enquiry.',
  },
  {
    value: 'payments',
    question: 'Are payments supported in this MVP?',
    answer:
      'No. Phase 1 is enquiry-first and manually operated. Billing and payment workflows can be added later without changing the customer journey foundation.',
  },
  {
    value: 'provisioning',
    question: 'Is GPU provisioning automated?',
    answer:
      'Not yet. Provisioning is manual in this MVP, but the architecture is prepared for future server inventory, provisioning, monitoring, and credential automation.',
  },
  {
    value: 'dashboard',
    question: 'What can customers see in the dashboard?',
    answer:
      'Customers can review their enquiries, see status history, access issued credentials, and manage basic profile details.',
  },
];

export function FaqPage() {
  const [openItem, setOpenItem] = useState(faqItems[0].value);

  return (
    <div className="mx-auto max-w-5xl space-y-16 py-8">
      <PublicPageHero
        eyebrow="FAQ"
        title="Questions worth asking before you request access."
        description="Clear answers for browsing packages, submitting enquiries, approvals, and credential handoff."
        variant="faq"
      />

      <section className="mx-auto max-w-4xl divide-y divide-white/10">
        {faqItems.map((item) => {
          const isOpen = openItem === item.value;
          const Icon = isOpen ? Minus : Plus;

          return (
            <article key={item.value}>
              <button
                type="button"
                className={cn(
                  'flex w-full items-center justify-between gap-6 py-8 text-left text-lg font-black text-white transition hover:text-brand-500',
                  focusRing
                )}
                aria-expanded={isOpen}
                onClick={() => setOpenItem(isOpen ? '' : item.value)}
              >
                <span>{item.question}</span>
                <Icon className="h-5 w-5 shrink-0 text-[#8FA39B]" />
              </button>
              {isOpen && (
                <p className="max-w-3xl pb-8 text-base leading-7 text-[#8FA39B]">{item.answer}</p>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}
