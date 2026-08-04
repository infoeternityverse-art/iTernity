export const emailTextStyles = {
  heading:
    'margin:0 0 12px;font-size:26px;line-height:34px;color:#111827;font-weight:800;letter-spacing:0;',
  body: 'margin:0;color:#374151;font-size:15px;line-height:24px;overflow-wrap:anywhere;word-break:break-word;',
  muted:
    'margin:20px 0 0;color:#6b7280;font-size:13px;line-height:21px;overflow-wrap:anywhere;word-break:break-word;',
  label:
    'margin:0 0 6px;color:#0f766e;font-size:12px;line-height:18px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;',
  value:
    'margin:0 0 16px;color:#111827;font-size:15px;line-height:23px;overflow-wrap:anywhere;word-break:break-word;',
};

export const renderField = ({ label, value }) => `
  <p style="${emailTextStyles.label}">${label}</p>
  <p style="${emailTextStyles.value}">${value}</p>
`;
