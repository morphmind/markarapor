interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

interface MailtrapResponse {
  success: boolean;
  message_ids?: string[];
}

const MAILTRAP_API_URL = "https://send.api.mailtrap.io/api/send";
const MAILTRAP_API_TOKEN = process.env.MAILTRAP_API_TOKEN;
const SENDER_EMAIL = process.env.MAILTRAP_SENDER_EMAIL || "noreply@markarapor.com";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "MarkaRapor";

export async function sendEmail(options: EmailOptions): Promise<MailtrapResponse> {
  if (!MAILTRAP_API_TOKEN) {
    console.warn("MAILTRAP_API_TOKEN not configured, skipping email");
    return { success: false };
  }

  const recipients = Array.isArray(options.to)
    ? options.to.map((email) => ({ email }))
    : [{ email: options.to }];

  const response = await fetch(MAILTRAP_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MAILTRAP_API_TOKEN}`,
    },
    body: JSON.stringify({
      from: {
        email: SENDER_EMAIL,
        name: APP_NAME,
      },
      to: recipients,
      subject: options.subject,
      html: options.html,
      text: options.text || stripHtml(options.html),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Mailtrap API error:", error);
    return { success: false };
  }

  const result = await response.json();
  return { success: true, message_ids: result.message_ids };
}

// Strip HTML tags for plain text version
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Email templates
export const emailTemplates = {
  // Workflow completed notification
  workflowCompleted: (data: {
    userName: string;
    workflowName: string;
    reportUrl: string;
  }) => ({
    subject: `${APP_NAME}: "${data.workflowName}" tamamlandı`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
            .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${APP_NAME}</h1>
            </div>
            <div class="content">
              <p>Merhaba ${data.userName},</p>
              <p><strong>"${data.workflowName}"</strong> workflow'unuz başarıyla tamamlandı ve raporunuz hazır!</p>
              <a href="${data.reportUrl}" class="button">Raporu Görüntüle</a>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. Tüm hakları saklıdır.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  // Workflow failed notification
  workflowFailed: (data: {
    userName: string;
    workflowName: string;
    errorMessage: string;
    dashboardUrl: string;
  }) => ({
    subject: `${APP_NAME}: "${data.workflowName}" başarısız oldu`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
            .error-box { background: #FEE2E2; border: 1px solid #FECACA; border-radius: 8px; padding: 15px; margin: 20px 0; }
            .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${APP_NAME}</h1>
            </div>
            <div class="content">
              <p>Merhaba ${data.userName},</p>
              <p><strong>"${data.workflowName}"</strong> workflow'unuz çalıştırılırken bir hata oluştu.</p>
              <div class="error-box">
                <strong>Hata:</strong> ${data.errorMessage}
              </div>
              <a href="${data.dashboardUrl}" class="button">Dashboard'a Git</a>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. Tüm hakları saklıdır.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  // Connection expired notification
  connectionExpired: (data: {
    userName: string;
    connectionName: string;
    provider: string;
    reconnectUrl: string;
  }) => ({
    subject: `${APP_NAME}: "${data.connectionName}" bağlantısı sona erdi`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
            .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${APP_NAME}</h1>
            </div>
            <div class="content">
              <p>Merhaba ${data.userName},</p>
              <p><strong>${data.provider}</strong> bağlantınız (<em>${data.connectionName}</em>) sona erdi veya geçersiz hale geldi.</p>
              <p>Workflow'larınızın düzgün çalışmaya devam edebilmesi için lütfen bağlantıyı yeniden oluşturun.</p>
              <a href="${data.reconnectUrl}" class="button">Yeniden Bağlan</a>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. Tüm hakları saklıdır.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  // Low credits warning
  lowCredits: (data: {
    userName: string;
    currentCredits: number;
    upgradeUrl: string;
  }) => ({
    subject: `${APP_NAME}: Krediniz azaldı`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
            .credit-box { background: #FEF3C7; border: 1px solid #FCD34D; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
            .credit-number { font-size: 48px; font-weight: bold; color: #D97706; }
            .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${APP_NAME}</h1>
            </div>
            <div class="content">
              <p>Merhaba ${data.userName},</p>
              <p>Kalan krediniz azaldı. Workflow'larınızın kesintisiz çalışmaya devam edebilmesi için planınızı yükseltmeyi düşünün.</p>
              <div class="credit-box">
                <div class="credit-number">${data.currentCredits}</div>
                <div>kalan kredi</div>
              </div>
              <a href="${data.upgradeUrl}" class="button">Planı Yükselt</a>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. Tüm hakları saklıdır.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  // Welcome email
  welcome: (data: { userName: string; dashboardUrl: string }) => ({
    subject: `${APP_NAME}'a Hoş Geldiniz!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
            .feature { display: flex; align-items: flex-start; margin: 15px 0; }
            .feature-icon { background: #EFF6FF; border-radius: 8px; padding: 10px; margin-right: 15px; }
            .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Hoş Geldiniz! 🎉</h1>
            </div>
            <div class="content">
              <p>Merhaba ${data.userName},</p>
              <p>${APP_NAME}'a kayıt olduğunuz için teşekkür ederiz! Dijital pazarlama raporlarınızı otomatikleştirmeye hazırsınız.</p>

              <h3>Başlangıç Adımları:</h3>
              <div class="feature">
                <div class="feature-icon">1️⃣</div>
                <div>
                  <strong>Marka Ekleyin</strong>
                  <p style="margin: 5px 0; color: #666;">Raporlarınızı organize etmek için markalarınızı ekleyin.</p>
                </div>
              </div>
              <div class="feature">
                <div class="feature-icon">2️⃣</div>
                <div>
                  <strong>Veri Kaynaklarını Bağlayın</strong>
                  <p style="margin: 5px 0; color: #666;">Google Ads, Analytics ve Search Console hesaplarınızı bağlayın.</p>
                </div>
              </div>
              <div class="feature">
                <div class="feature-icon">3️⃣</div>
                <div>
                  <strong>İlk Workflow'unuzu Oluşturun</strong>
                  <p style="margin: 5px 0; color: #666;">Hazır şablonlardan birini seçin veya sıfırdan oluşturun.</p>
                </div>
              </div>

              <a href="${data.dashboardUrl}" class="button">Dashboard'a Git</a>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} ${APP_NAME}. Tüm hakları saklıdır.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};

// Helper to send templated emails
export async function sendTemplatedEmail<T extends keyof typeof emailTemplates>(
  to: string | string[],
  template: T,
  data: Parameters<(typeof emailTemplates)[T]>[0]
): Promise<MailtrapResponse> {
  const templateFn = emailTemplates[template] as (arg: unknown) => { subject: string; html: string };
  const { subject, html } = templateFn(data);
  return sendEmail({ to, subject, html });
}
