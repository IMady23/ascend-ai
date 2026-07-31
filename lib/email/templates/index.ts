export function getTemplate(templateName: string, data?: any): string {
  const getBody = () => {
    switch (templateName) {
      case 'welcome':
        return `
          <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Welcome to Ascend AI, ${data?.name || 'Commander'}!</h1>
          <p style="color: #a1a1aa; font-size: 16px; line-height: 1.5;">We are thrilled to have you on board. Your journey starts now.</p>
        `;
      case 'reminder':
        return `
          <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; margin-bottom: 16px;">${data?.title || 'Daily Task'}</h1>
          <p style="color: #a1a1aa; font-size: 16px; line-height: 1.5;">${data?.description || "Don't forget to complete your task!"}</p>
        `;
      case 'weekly':
        return `
          <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; margin-bottom: 16px;">${data?.title || 'Your Weekly Summary'}</h1>
          <p style="color: #a1a1aa; font-size: 16px; line-height: 1.5;">${data?.description || 'Keep up the great work!'}</p>
        `;
      case 'achievement':
        return `
          <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; margin-bottom: 16px;">${data?.title || 'Congratulations!'}</h1>
          <p style="color: #a1a1aa; font-size: 16px; line-height: 1.5;">${data?.description || 'You just unlocked a new milestone.'}</p>
        `;
      case 'reset-password':
        return `
          <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Password Reset Request</h1>
          <p style="color: #a1a1aa; font-size: 16px; line-height: 1.5;">Click <a href="${data?.link || '#'}" style="color: #9333ea;">here</a> to reset your password.</p>
        `;
      default:
        return `<h1 style="color: #ffffff; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Hello from Ascend AI</h1>`;
    }
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="background-color: #09090b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px 20px; margin: 0;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 40px; text-align: left;">
                <tr>
                  <td>
                    ${getBody()}
                    <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #27272a;">
                      <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 8px 0; font-weight: 500;">Stay consistent. Stay strong.</p>
                      <p style="color: #71717a; font-size: 14px; margin: 0;">&mdash; Ascend AI Coach</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
