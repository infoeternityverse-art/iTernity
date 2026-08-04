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
  <body style="margin:0;background:#f3f7f6;color:#111827;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preview}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f7f6;padding:28px 14px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;border:1px solid #d8e7e3;border-radius:8px;background:#ffffff;overflow:hidden;table-layout:fixed;">
            <tr>
              <td style="padding:28px 30px 16px;background:#ffffff;">
                ${renderBrandLogo({ brandName: notificationConfig.brandName })}
              </td>
            </tr>
            <tr>
              <td style="padding:8px 30px 34px;overflow-wrap:anywhere;word-break:break-word;">
                ${children}
              </td>
            </tr>
            <tr>
              <td style="padding:22px 30px;background:#f8fbfa;border-top:1px solid #d8e7e3;">
                <p style="margin:0 0 8px;color:#4b5563;font-size:13px;line-height:21px;overflow-wrap:anywhere;word-break:break-word;">Need help? Contact ${notificationConfig.supportEmail}.</p>
                <p style="margin:0;color:#6b7280;font-size:12px;line-height:20px;">Copyright ${year} ${notificationConfig.brandName}. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
