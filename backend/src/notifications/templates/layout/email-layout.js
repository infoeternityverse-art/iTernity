import { notificationConfig } from '../../../config/notification.config.js';
import { renderBrandLogo } from '../components/brand-logo.js';

export const renderEmailLayout = ({ title, preview, children }) => {
  const year = new Date().getFullYear();

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;background:#edf6f3;color:#111827;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preview}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;background:#edf6f3;padding:32px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:620px;border:1px solid #cfe3dd;border-radius:16px;background:#ffffff;overflow:hidden;table-layout:fixed;box-shadow:0 18px 48px rgba(3,17,13,0.08);">
            <tr>
              <td height="5" style="height:5px;background:#2de8c4;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:27px 32px 17px;background:#ffffff;">
                ${renderBrandLogo({ brandName: notificationConfig.brandName })}
              </td>
            </tr>
            <tr>
              <td style="padding:10px 32px 36px;background:#ffffff;overflow-wrap:anywhere;word-break:break-word;">
                ${children}
              </td>
            </tr>
            <tr>
              <td style="padding:22px 32px;background:#f5faf8;border-top:1px solid #d8e7e3;">
                <p style="margin:0 0 8px;color:#4b5563;font-size:13px;line-height:21px;overflow-wrap:anywhere;word-break:break-word;">Need help? Contact ${notificationConfig.supportEmail}.</p>
                <p style="margin:0;color:#6b7280;font-size:12px;line-height:20px;">Copyright ${year} ${notificationConfig.brandName}. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin:16px 0 0;color:#789087;font-size:11px;line-height:18px;text-align:center;">Secure GPU infrastructure communication from ${notificationConfig.brandName}</p>
  </body>
</html>`;
};
