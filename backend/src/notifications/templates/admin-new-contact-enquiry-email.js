import { notificationConfig } from '../../config/notification.config.js';
import { renderButton } from './components/button.js';
import { renderDivider } from './components/divider.js';
import { escapeHtml } from './components/html.js';
import { emailTextStyles, renderField } from './components/text.js';
import { renderEmailLayout } from './layout/email-layout.js';

export const adminNewContactEnquiryEmailTemplate = ({ contactEnquiry }) =>
  renderEmailLayout({
    title: 'New contact enquiry received',
    preview: 'A visitor submitted the general contact form.',
    children: `
      <h1 style="${emailTextStyles.heading}">New contact enquiry.</h1>
      <p style="${emailTextStyles.body}">A visitor submitted the general contact form.</p>
      ${renderDivider()}
      ${renderField({ label: 'Contact', value: `${escapeHtml(contactEnquiry.contactName)} (${escapeHtml(contactEnquiry.contactEmail)})` })}
      ${renderField({ label: 'Phone', value: escapeHtml(contactEnquiry.contactPhone || 'Not provided') })}
      ${renderField({ label: 'Subject', value: escapeHtml(contactEnquiry.subject) })}
      <p style="${emailTextStyles.label}">Message</p>
      <p style="${emailTextStyles.body}">${escapeHtml(contactEnquiry.message)}</p>
      ${renderDivider()}
      ${renderButton({ href: `${notificationConfig.adminDashboardUrl}/contact-enquiries`, label: 'Review contact enquiries' })}
    `,
  });
