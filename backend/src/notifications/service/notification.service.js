import { User, USER_ROLES } from '../../models/index.js';
import { notificationConfig } from '../../config/notification.config.js';
import { emailProvider } from '../providers/email.provider.js';
import {
  adminNewContactEnquiryEmailTemplate,
  adminNewEnquiryEmailTemplate,
  contactEnquiryReceivedEmailTemplate,
  contactEnquiryStatusUpdatedEmailTemplate,
  credentialIssuedEmailTemplate,
  criticalSystemErrorEmailTemplate,
  enquiryReceivedEmailTemplate,
  enquiryStatusUpdatedEmailTemplate,
  emailChangeVerificationEmailTemplate,
  passwordChangedEmailTemplate,
  passwordResetEmailTemplate,
  profileUpdatedEmailTemplate,
  welcomeEmailTemplate,
} from '../templates/index.js';

const createTextFallback = (message) => message.replace(/\s+/g, ' ').trim();
const normalizeEmailList = (emails) =>
  emails
    .map((email) =>
      String(email || '')
        .trim()
        .toLowerCase()
    )
    .filter(Boolean);

class NotificationService {
  async runSafely(type, task) {
    try {
      await task();
    } catch (error) {
      console.error(`[notification] ${new Date().toISOString()} ${type} failed: ${error.message}`);
    }
  }

  async sendEmail({ type, to, subject, html, text }) {
    const timestamp = new Date().toISOString();

    if (!to) {
      console.warn(`[notification] ${timestamp} ${type} skipped: missing recipient`);
      return;
    }

    try {
      const result = await emailProvider.send({
        to,
        subject,
        html,
        text: text || createTextFallback(subject),
      });

      if (result?.skipped) {
        console.warn(`[notification] ${timestamp} ${type} skipped for ${to}: ${result.reason}`);
        return;
      }

      console.info(`[notification] ${timestamp} ${type} sent to ${to}`);
    } catch (error) {
      console.error(`[notification] ${timestamp} ${type} failed for ${to}: ${error.message}`);
    }
  }

  async sendWelcomeEmail(user) {
    await this.runSafely('welcome', async () =>
      this.sendEmail({
        type: 'welcome',
        to: user.email,
        subject: 'Welcome to iTernityverse',
        html: welcomeEmailTemplate({ user }),
        text: `Welcome to iTernityverse, ${user.name}. Your dashboard is ready.`,
      })
    );
  }

  async sendEnquiryReceived({ enquiry, gpuPackage }) {
    await this.runSafely('enquiry.received', async () =>
      this.sendEmail({
        type: 'enquiry.received',
        to: enquiry.contactEmail,
        subject: 'We received your GPU rental enquiry',
        html: enquiryReceivedEmailTemplate({ enquiry, gpuPackage }),
        text: `We received your enquiry ${enquiry._id}. Our team will review it within 1 business day.`,
      })
    );
  }

  async sendContactEnquiryReceived(contactEnquiry) {
    await this.runSafely('contact_enquiry.received', async () =>
      this.sendEmail({
        type: 'contact_enquiry.received',
        to: contactEnquiry.contactEmail,
        subject: 'We received your message',
        html: contactEnquiryReceivedEmailTemplate({ contactEnquiry }),
        text: `We received your contact request ${contactEnquiry._id}. Our team will reply as soon as possible.`,
      })
    );
  }

  async sendContactEnquiryStatusUpdated(contactEnquiry) {
    await this.runSafely('contact_enquiry.status_updated', async () =>
      this.sendEmail({
        type: 'contact_enquiry.status_updated',
        to: contactEnquiry.contactEmail,
        subject:
          contactEnquiry.status === 'closed'
            ? 'Your contact enquiry was closed'
            : 'Your contact enquiry was resolved',
        html: contactEnquiryStatusUpdatedEmailTemplate({ contactEnquiry }),
        text: `Your contact enquiry ${contactEnquiry._id} is now ${contactEnquiry.status}.`,
      })
    );
  }

  async sendEnquiryStatusUpdated({ enquiry, gpuPackage }) {
    await this.runSafely('enquiry.status_updated', async () =>
      this.sendEmail({
        type: 'enquiry.status_updated',
        to: enquiry.contactEmail,
        subject: `Your enquiry is now ${enquiry.status}`,
        html: enquiryStatusUpdatedEmailTemplate({ enquiry, gpuPackage }),
        text: `Your GPU enquiry status changed to ${enquiry.status}.`,
      })
    );
  }

  async sendCredentialIssued({ credential, gpuPackage, customer }) {
    await this.runSafely('credential.issued', async () =>
      this.sendEmail({
        type: 'credential.issued',
        to: customer?.email,
        subject: 'Your GPU access credentials are ready',
        html: credentialIssuedEmailTemplate({ credential, gpuPackage }),
        text: 'Your GPU credentials are available securely in your dashboard. Passwords are not sent by email.',
      })
    );
  }

  async sendPasswordReset({ user, resetUrl, expiresIn }) {
    await this.runSafely('password.reset', async () =>
      this.sendEmail({
        type: 'password.reset',
        to: user.email,
        subject: 'Reset your iTernityverse password',
        html: passwordResetEmailTemplate({ resetUrl, expiresIn }),
        text: `Reset your password using this secure link: ${resetUrl}`,
      })
    );
  }

  async sendPasswordChanged(user) {
    await this.runSafely('password.changed', async () =>
      this.sendEmail({
        type: 'password.changed',
        to: user.email,
        subject: 'Your iTernityverse password was changed',
        html: passwordChangedEmailTemplate(),
        text: 'Your password was changed successfully. Contact support if this was not you.',
      })
    );
  }

  async sendProfileUpdated(user) {
    await this.runSafely('profile.updated', async () =>
      this.sendEmail({
        type: 'profile.updated',
        to: user.email,
        subject: 'Your iTernityverse profile was updated',
        html: profileUpdatedEmailTemplate({ user }),
        text: 'Your profile information was updated successfully.',
      })
    );
  }

  async sendEmailChangeVerification({ to, verificationUrl, newEmail, isCurrent }) {
    const result = await emailProvider.send({
      to,
      subject: 'Confirm your iTernityverse email change',
      html: emailChangeVerificationEmailTemplate({ verificationUrl, newEmail, isCurrent }),
      text: `Confirm your email change using this secure link: ${verificationUrl}`,
    });

    if (result?.skipped) {
      throw new Error(`Email change verification could not be sent: ${result.reason}`);
    }

    console.info(
      `[notification] ${new Date().toISOString()} email.change_verification sent to ${to}`
    );
  }

  async sendNewEnquiryNotification({ enquiry, gpuPackage }) {
    await this.runSafely('admin.enquiry.created', async () => {
      const admins = await User.find({ role: USER_ROLES.ADMIN, isActive: true }).select('email');
      const configuredRecipients = normalizeEmailList(notificationConfig.adminNotificationEmails);
      const recipients = configuredRecipients.length
        ? configuredRecipients
        : normalizeEmailList(admins.map((admin) => admin.email));
      const uniqueRecipients = [...new Set(recipients)];

      if (!uniqueRecipients.length) {
        console.warn(
          `[notification] ${new Date().toISOString()} admin.enquiry.created skipped: no admin recipients`
        );
        return;
      }

      await Promise.all(
        uniqueRecipients.map((recipient) =>
          this.sendEmail({
            type: 'admin.enquiry.created',
            to: recipient,
            subject: 'New GPU rental enquiry received',
            html: adminNewEnquiryEmailTemplate({ enquiry, gpuPackage }),
            text: `New enquiry from ${enquiry.contactName} for ${
              gpuPackage?.name || 'GPU package'
            }.`,
          })
        )
      );
    });
  }

  async sendNewContactEnquiryNotification(contactEnquiry) {
    await this.runSafely('admin.contact_enquiry.created', async () => {
      const admins = await User.find({ role: USER_ROLES.ADMIN, isActive: true }).select('email');
      const configuredRecipients = normalizeEmailList(notificationConfig.adminNotificationEmails);
      const recipients = configuredRecipients.length
        ? configuredRecipients
        : normalizeEmailList(admins.map((admin) => admin.email));
      const uniqueRecipients = [...new Set(recipients)];

      if (!uniqueRecipients.length) {
        console.warn(
          `[notification] ${new Date().toISOString()} admin.contact_enquiry.created skipped: no admin recipients`
        );
        return;
      }

      await Promise.all(
        uniqueRecipients.map((recipient) =>
          this.sendEmail({
            type: 'admin.contact_enquiry.created',
            to: recipient,
            subject: 'New contact enquiry received',
            html: adminNewContactEnquiryEmailTemplate({ contactEnquiry }),
            text: `New contact enquiry from ${contactEnquiry.contactName}: ${contactEnquiry.subject}.`,
          })
        )
      );
    });
  }

  async sendCriticalSystemError({ to, summary }) {
    await this.runSafely('system.critical_error', async () =>
      this.sendEmail({
        type: 'system.critical_error',
        to,
        subject: 'Critical system error',
        html: criticalSystemErrorEmailTemplate({ summary }),
        text: summary,
      })
    );
  }
}

export const notificationService = new NotificationService();
