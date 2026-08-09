import { renderButton } from './components/button.js';
import { escapeHtml } from './components/html.js';
import { emailTextStyles } from './components/text.js';
import { renderEmailLayout } from './layout/email-layout.js';

export const emailChangeVerificationEmailTemplate = ({ verificationUrl, newEmail, isCurrent }) =>
  renderEmailLayout({
    title: 'Confirm email change',
    preview: 'Confirm the requested change to your iTernityverse account email.',
    children: `
      <h1 style="${emailTextStyles.heading}">Confirm your email change.</h1>
      <p style="${emailTextStyles.body}">${
        isCurrent
          ? `Approve changing your iTernityverse sign-in email to ${escapeHtml(newEmail)}.`
          : `Confirm that ${escapeHtml(newEmail)} should become your iTernityverse sign-in email.`
      }</p>
      <p style="${emailTextStyles.body}">The address will not change until the required confirmations are completed.</p>
      ${renderButton({ href: verificationUrl, label: 'Confirm email change' })}
      <p style="${emailTextStyles.muted}">If you did not request this change, do not use this link and contact support.</p>
    `,
  });
