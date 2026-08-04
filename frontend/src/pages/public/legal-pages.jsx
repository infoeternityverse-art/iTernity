import { Link } from 'react-router-dom';
import { PublicPageHero } from '@/components/common/public-page-hero.jsx';
import { Seo } from '@/components/common/seo.jsx';
import { env } from '@/config/env.js';
import { createBreadcrumbSchema } from '@/utils/seo-schema.js';

const updatedAt = 'August 4, 2026';

const pageContent = {
  privacy: {
    eyebrow: 'Privacy',
    title: 'Privacy Policy',
    description:
      'How iTernityverse collects, uses, protects, and handles information submitted through the GPU rental marketplace.',
    path: '/privacy',
    sections: [
      {
        title: 'Information We Collect',
        body: [
          'We collect account details, contact information, enquiry details, and operational information needed to review GPU access requests.',
          'When customers use the dashboard, we store profile updates, enquiry status history, and credential records required for service delivery.',
          'We may receive technical information such as IP address, browser details, device type, and request logs for security, troubleshooting, and abuse prevention.',
        ],
      },
      {
        title: 'How We Use Information',
        body: [
          'We use information to process enquiries, manage customer accounts, issue credentials, send transactional emails, improve platform reliability, and protect the service.',
          'We do not sell customer personal information. Access is limited to team members and service providers who need it for platform operation.',
        ],
      },
      {
        title: 'Service Providers',
        body: [
          'The platform uses hosting, database, media, email, analytics, and AI service providers. These providers process data only as needed for infrastructure, support, communication, and product functionality.',
          'Current production services include Vercel, Northflank, MongoDB Atlas, Cloudinary, Hostinger email, and configured AI providers.',
        ],
      },
      {
        title: 'Data Protection',
        body: [
          'Passwords are hashed and credential secrets are encrypted at rest for new writes. Sensitive credentials are not sent by email.',
          'We use HTTPS, role-based access controls, API rate limits, audit logs, and environment-managed secrets to reduce operational risk.',
        ],
      },
      {
        title: 'Retention And Contact',
        body: [
          'We retain records while they are needed for account operation, support, security, legal, or business purposes.',
          `For privacy requests, contact ${env.supportEmail}.`,
        ],
      },
    ],
  },
  terms: {
    eyebrow: 'Terms',
    title: 'Terms of Access',
    description:
      'Terms for browsing iTernityverse, submitting GPU rental enquiries, using customer dashboards, and accessing issued credentials.',
    path: '/terms',
    sections: [
      {
        title: 'Use Of The Platform',
        body: [
          'iTernityverse provides an enquiry-first GPU rental marketplace. Browsing packages does not guarantee availability, approval, pricing, or access.',
          'Customers are responsible for providing accurate project, contact, and workload information during enquiry and account flows.',
        ],
      },
      {
        title: 'Approval And Credentials',
        body: [
          'GPU access is reviewed manually. We may approve, reject, pause, or request more information for any enquiry.',
          'Issued credentials are for the approved customer and workload only. Customers must keep credentials private and report suspected compromise immediately.',
        ],
      },
      {
        title: 'Service Changes',
        body: [
          'GPU packages, regions, pricing, availability, and workflow details may change as infrastructure and operations evolve.',
          'We may update or discontinue features when needed for security, maintenance, capacity, or business reasons.',
        ],
      },
      {
        title: 'Customer Responsibilities',
        body: [
          'Customers must use the service lawfully, respect third-party rights, and avoid activity that harms infrastructure, users, or service reputation.',
          'Customers are responsible for their data, workloads, models, outputs, dependencies, and compliance obligations.',
        ],
      },
      {
        title: 'Contact',
        body: [`For account, access, or terms questions, contact ${env.supportEmail}.`],
      },
    ],
  },
  security: {
    eyebrow: 'Security',
    title: 'Security',
    description:
      'Security practices for iTernityverse account access, credential handling, backend APIs, notifications, and production infrastructure.',
    path: '/security',
    sections: [
      {
        title: 'Account And API Security',
        body: [
          'The platform uses JWT authentication, role-based route protection, password hashing, validation, CORS restrictions, and rate limiting.',
          'Admin routes require admin authorization. Customer APIs are scoped to the authenticated customer.',
        ],
      },
      {
        title: 'Credential Handling',
        body: [
          'Credential secrets are encrypted at rest for new writes. Passwords and credential passwords are not sent through notification emails.',
          'Customers should reveal and copy credentials only on trusted devices and report suspected exposure immediately.',
        ],
      },
      {
        title: 'Infrastructure',
        body: [
          'Production traffic uses HTTPS through managed hosting providers. Backend services run behind Northflank routing with proxy trust configured for accurate request handling.',
          'Database, media, email, and API provider credentials are stored as environment secrets and should never be committed to Git.',
        ],
      },
      {
        title: 'Monitoring And Abuse Prevention',
        body: [
          'The backend includes request rate limiting, password reset abuse limits, MongoDB operator sanitization, JSON body limits, and audit logging for admin/customer actions.',
          'Operational logs should be monitored for unusual request spikes, email failures, authentication failures, and service errors.',
        ],
      },
      {
        title: 'Reporting',
        body: [`Report security concerns to ${env.supportEmail} with clear reproduction details.`],
      },
    ],
  },
  acceptableUse: {
    eyebrow: 'Acceptable Use',
    title: 'Acceptable Use Policy',
    description:
      'Rules for safe and responsible use of iTernityverse GPU rental enquiries, accounts, credentials, and compute access.',
    path: '/acceptable-use',
    sections: [
      {
        title: 'Allowed Use',
        body: [
          'The service is intended for legitimate AI, rendering, research, development, inference, and compute workloads approved through the enquiry workflow.',
          'Customers should use only the access, regions, resources, and duration approved for their project.',
        ],
      },
      {
        title: 'Prohibited Activity',
        body: [
          'Do not use the platform for unlawful activity, malware, credential theft, spam, phishing, denial-of-service activity, abusive automation, or attempts to bypass access controls.',
          'Do not mine cryptocurrency, resell access, probe infrastructure, attack other systems, or process data you are not authorized to use.',
        ],
      },
      {
        title: 'Resource Conduct',
        body: [
          'Customers must avoid workloads that degrade service stability, violate provider terms, or create unreasonable operational risk.',
          'We may throttle, suspend, revoke credentials, or reject requests when usage threatens security, reliability, legality, or platform reputation.',
        ],
      },
      {
        title: 'Content And Outputs',
        body: [
          'Customers are responsible for datasets, models, prompts, outputs, licenses, and any compliance duties tied to their workload.',
          'Do not use the service to generate or distribute content that violates law, third-party rights, or platform safety requirements.',
        ],
      },
      {
        title: 'Questions',
        body: [
          `For acceptable use questions before submitting a workload, contact ${env.supportEmail}.`,
        ],
      },
    ],
  },
};

function LegalPage({ content }) {
  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-8">
      <Seo
        title={content.title}
        description={content.description}
        path={content.path}
        structuredData={[
          createBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: content.title, path: content.path },
          ]),
        ]}
      />
      <PublicPageHero
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        variant="faq"
      />

      <section className="space-y-4">
        <p className="text-sm font-semibold text-[#8FA39B]">Last updated: {updatedAt}</p>
        <div className="space-y-10 rounded-card border border-[rgba(45,232,196,0.15)] bg-[#0E1310]/88 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur md:p-8">
          <div className="space-y-4 border-b border-white/10 pb-8">
            <p className="text-sm leading-6 text-[#CFE7DF]">
              This page is provided for operational transparency. It is not a substitute for legal
              advice, and it may be updated as the platform, providers, or workflows change.
            </p>
            <p className="text-sm leading-6 text-[#8FA39B]">
              Questions can be sent to{' '}
              <a href={`mailto:${env.supportEmail}`} className="font-semibold text-white">
                {env.supportEmail}
              </a>
              .
            </p>
          </div>

          <div className="space-y-10">
            {content.sections.map((section) => (
              <section key={section.title} className="space-y-4">
                <h2 className="text-2xl font-black tracking-normal text-white">{section.title}</h2>
                <div className="space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-6 text-[#8FA39B]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#8FA39B]">Need help with access or policy questions?</p>
            <Link to="/contact" className="text-sm font-semibold text-white hover:text-brand-400">
              Contact iTernityverse
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export function PrivacyPolicyPage() {
  return <LegalPage content={pageContent.privacy} />;
}

export function TermsOfAccessPage() {
  return <LegalPage content={pageContent.terms} />;
}

export function SecurityPage() {
  return <LegalPage content={pageContent.security} />;
}

export function AcceptableUsePage() {
  return <LegalPage content={pageContent.acceptableUse} />;
}
