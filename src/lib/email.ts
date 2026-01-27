import nodemailer from "nodemailer";

/**
 * Email configuration for Microsoft 365
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.office365.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Contact form data structure
 */
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
}

/**
 * Send a thank you email to the customer
 */
export async function sendThankYouEmail(data: ContactFormData): Promise<void> {
  const fromEmail = process.env.SMTP_FROM_EMAIL;
  const fromName = process.env.SMTP_FROM_NAME || "My Customs";
  const reachOutEmail = process.env.REACH_OUT_EMAIL || fromEmail;
  const siteUrl = process.env.SITE_URL || "https://mycustoms.com";
  const logoUrl = `${siteUrl}/images/email-logo.png`;

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: data.email,
    subject: "Thank you for contacting My Customs",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e0e0e0;">
                  
                  <!-- Logo -->
                  <tr>
                    <td style="padding: 30px 40px 20px; text-align: center;">
                      <img src="${logoUrl}" alt="My Customs" width="150" style="display: block; margin: 0 auto;">
                    </td>
                  </tr>
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #3871C1 0%, #2563a8 100%); padding: 40px; text-align: center;">
                      <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 500;">Thank You</h1>
                      <p style="color: rgba(255,255,255,0.85); margin: 10px 0 0; font-size: 14px; font-weight: 300;">We've received your enquiry</p>
                    </td>
                  </tr>
                  
                  <!-- Main content -->
                  <tr>
                    <td style="padding: 36px 40px;">
                      <p style="color: #333; font-size: 15px; margin: 0 0 20px; line-height: 1.7;">
                        Dear <span style="color: #3871C1; font-weight: 500;">${data.name}</span>,
                      </p>
                      
                      <p style="color: #666; font-size: 14px; margin: 0 0 28px; line-height: 1.8;">
                        Thank you for reaching out to My Customs. Our team has received your enquiry and will respond within 24-48 hours.
                      </p>
                      
                      <!-- Enquiry Details -->
                      <div style="border-top: 1px solid #eee; padding-top: 24px;">
                        <p style="color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 16px;">Enquiry Details</p>
                        
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                              <span style="color: #999; font-size: 12px;">Service</span>
                            </td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; text-align: right;">
                              <span style="color: #333; font-size: 13px;">${data.service}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                              <span style="color: #999; font-size: 12px;">Company</span>
                            </td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; text-align: right;">
                              <span style="color: #333; font-size: 13px;">${data.company}</span>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2" style="padding: 14px 0 0;">
                              <span style="color: #999; font-size: 12px; display: block; margin-bottom: 6px;">Message</span>
                              <span style="color: #555; font-size: 13px; line-height: 1.7; display: block;">${data.message}</span>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- Signature -->
                      <div style="border-top: 1px solid #eee; padding-top: 24px; margin-top: 28px;">
                        <p style="color: #888; font-size: 13px; margin: 0; line-height: 1.7;">
                          Best regards,<br>
                          <span style="color: #555;">The My Customs Team</span>
                        </p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Contact Section -->
                  <tr>
                    <td style="padding: 28px 40px; text-align: center; border-top: 1px solid #eee;">
                      <p style="color: #666; font-size: 14px; margin: 0 0 12px;">
                        Have questions? Feel free to reach out to us anytime.
                      </p>
                      <a href="mailto:${reachOutEmail}" style="color: #3871C1; font-size: 15px; text-decoration: none; font-weight: 500;">
                        ${reachOutEmail}
                      </a>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 40px; text-align: center; background: #2a3a4a;">
                      <p style="color: #7eb8ff; font-size: 13px; margin: 0;">
                        Thank you for choosing My Customs
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}

/**
 * Send contact form notification to the business
 */
export async function sendContactNotification(
  data: ContactFormData
): Promise<void> {
  const fromEmail = process.env.SMTP_FROM_EMAIL;
  const fromName = process.env.SMTP_FROM_NAME || "My Customs Website";
  const recipientEmail = process.env.CONTACT_FORM_RECIPIENT;
  const siteUrl = process.env.SITE_URL || "https://mycustoms.com";
  const logoUrl = `${siteUrl}/images/email-logo.png`;

  if (!recipientEmail) {
    throw new Error("CONTACT_FORM_RECIPIENT environment variable is not set");
  }

  await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: recipientEmail,
    replyTo: data.email,
    subject: `New Contact Form Submission - ${data.service}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e0e0e0;">
                  
                  <!-- Logo -->
                  <tr>
                    <td style="padding: 30px 40px 20px; text-align: center;">
                      <img src="${logoUrl}" alt="My Customs" width="150" style="display: block; margin: 0 auto;">
                    </td>
                  </tr>
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #3871C1 0%, #2563a8 100%); padding: 40px; text-align: center;">
                      <p style="color: rgba(255,255,255,0.85); font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">New Enquiry</p>
                      <h1 style="color: white; margin: 0; font-size: 22px; font-weight: 500;">Contact Form Submission</h1>
                    </td>
                  </tr>
                  
                  <!-- Contact Details -->
                  <tr>
                    <td style="padding: 36px 40px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                            <span style="color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Name</span>
                            <p style="color: #333; margin: 4px 0 0; font-size: 14px;">${data.name}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                            <span style="color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Company</span>
                            <p style="color: #333; margin: 4px 0 0; font-size: 14px;">${data.company}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                            <span style="color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Email</span>
                            <p style="margin: 4px 0 0;"><a href="mailto:${data.email}" style="color: #3871C1; font-size: 14px; text-decoration: none;">${data.email}</a></p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                            <span style="color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Phone</span>
                            <p style="margin: 4px 0 0;"><a href="tel:${data.phone}" style="color: #3871C1; font-size: 14px; text-decoration: none;">${data.phone}</a></p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
                            <span style="color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Service</span>
                            <p style="color: #333; margin: 4px 0 0; font-size: 14px;">${data.service}</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0;">
                            <span style="color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Message</span>
                            <p style="color: #555; margin: 8px 0 0; font-size: 13px; line-height: 1.8; white-space: pre-wrap;">${data.message}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  
                  <!-- CTA -->
                  <tr>
                    <td style="padding: 0 40px 32px; text-align: center;">
                      <a href="mailto:${data.email}" style="display: inline-block; background: #3871C1; color: white; padding: 12px 32px; text-decoration: none; border-radius: 50px; font-weight: 500; font-size: 13px;">
                        Reply to Customer
                      </a>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 24px 40px; text-align: center; background: #2a3a4a;">
                      <p style="color: #aaa; font-size: 11px; margin: 0;">
                        Submitted on ${new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
}
