import { notificationConfig } from '../../config/notification.config.js';
import { renderButton } from './components/button.js';
import { renderDivider } from './components/divider.js';
import { escapeHtml } from './components/html.js';
import { emailTextStyles, renderField } from './components/text.js';
import { renderEmailLayout } from './layout/email-layout.js';

export const contactEnquiryReceivedEmailTemplate = ({ contactEnquiry }) =>
  renderEmailLayout({
    title: 'Contact request received',
    preview: 'Your message has been received by the iTernityverse team.',
    children: `
      <h1 style="${emailTextStyles.heading}">We received your message.</h1>
      <p style="${emailTextStyles.body}">Thanks for contacting iTernityverse. Our team will review your message and reply as soon as possible.</p>
      ${renderDivider()}
      ${renderField({ label: 'Contact Request ID', value: escapeHtml(contactEnquiry._id) })}
      ${renderField({ label: 'Subject', value: escapeHtml(contactEnquiry.subject) })}
      <p style="${emailTextStyles.label}">Message</p>
      <p style="${emailTextStyles.body}">${escapeHtml(contactEnquiry.message)}</p>
      ${renderDivider()}
      ${renderButton({ href: notificationConfig.frontendUrl, label: 'Visit iTernityverse' })}
    `,
  });
