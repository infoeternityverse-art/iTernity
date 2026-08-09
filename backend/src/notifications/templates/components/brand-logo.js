export const renderBrandLogo = ({ brandName }) => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td width="42" height="42" align="center" valign="middle" style="width:42px;height:42px;border-radius:9px;background:#2DE8C4;text-align:center;vertical-align:middle;">
        <span style="display:block;width:42px;color:#03110d;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:900;line-height:42px;text-align:center;">i</span>
      </td>
      <td width="12" style="width:12px;font-size:0;line-height:0;">&nbsp;</td>
      <td valign="middle" style="color:#111827;font-family:Arial,Helvetica,sans-serif;font-size:17px;font-weight:800;line-height:22px;vertical-align:middle;white-space:nowrap;">${brandName}</td>
    </tr>
  </table>
`;
