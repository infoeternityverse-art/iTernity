import { notificationConfig } from '../../config/notification.config.js';
import { renderButton } from './components/button.js';
import { renderDivider } from './components/divider.js';
import { escapeHtml } from './components/html.js';
import { emailTextStyles, renderField } from './components/text.js';
import { renderEmailLayout } from './layout/email-layout.js';

const statusCopy = {
  resolved: {
    title: 'Your contact enquiry was resolved.',
    body: 'Our team marked your contact enquiry as resolved. If you still need help, reply to the team or submit a new contact request.',
  },
  closed: {
    title: 'Your contact enquiry was closed.',
    body: 'Your contact enquiry has been closed. You can contact us again anytime if you need more help.',
  },
  in_review: {
    title: 'Your contact enquiry is in review.',
    body: 'Our team is reviewing your message and will follow up if more information is needed.',
  },
};

export const contactEnquiryStatusUpdatedEmailTemplate = ({ contactEnquiry }) => {
  const copy = statusCopy[contactEnquiry.status] || statusCopy.in_review;

  return renderEmailLayout({
    title: copy.title,
    preview: copy.body,
    children: `
      <h1 style="${emailTextStyles.heading}">${copy.title}</h1>
      <p style="${emailTextStyles.body}">${copy.body}</p>
      ${renderDivider()}
      ${renderField({ label: 'Contact Request ID', value: escapeHtml(contactEnquiry._id) })}
      ${renderField({ label: 'Subject', value: escapeHtml(contactEnquiry.subject) })}
      ${renderField({ label: 'Current Status', value: escapeHtml(contactEnquiry.status) })}
      ${renderDivider()}
      ${renderButton({ href: notificationConfig.frontendUrl, label: 'Visit iTernityverse' })}
    `,
  });
};
