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
  const reachOutPhone = process.env.REACH_OUT_PHONE || "";
  const siteUrl = process.env.SITE_URL || "https://mycustoms-website.vercel.app";
  const logoUrl = `${siteUrl}/images/email-logo-white.png`;
  const currentYear = new Date().getFullYear();

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
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f0f0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f0f0f0; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background: #ffffff; border-radius: 12px; overflow: hidden;">
                  
                  <!-- Header with Logo -->
                  <tr>
                    <td style="background: #2B7FFF; padding: 20px 40px 40px; text-align: center;">
                      <img src="${logoUrl}" alt="My Customs" width="120" style="display: block; margin: 0 auto 24px;">
                      <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 600;">Thank You!</h1>
                      <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0; font-size: 15px; font-weight: 300;">We've received your enquiry</p>
                    </td>
                  </tr>
                  
                  <!-- Main content -->
                  <tr>
                    <td style="padding: 40px 40px 32px;">
                      <p style="color: #333; font-size: 15px; margin: 0 0 16px; line-height: 1.6;">
                        Dear <span style="font-weight: 600;">${data.name}</span>,
                      </p>
                      
                      <p style="color: #555; font-size: 14px; margin: 0 0 32px; line-height: 1.8;">
                        Thank you for reaching out to My Customs. Our team has received your enquiry and will respond within <span style="color: #3871C1; font-weight: 500;">24-48 hours</span>.
                      </p>
                      
                      <!-- Enquiry Details -->
                      <p style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 16px;">Enquiry Details</p>
                      
                      <div style="background: #f8f9fa; border-radius: 12px; padding: 4px 20px;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding: 14px 0; border-bottom: 1px solid #eee;">
                              <span style="color: #888; font-size: 13px;">Service</span>
                            </td>
                            <td style="padding: 14px 0; border-bottom: 1px solid #eee; text-align: right;">
                              <span style="color: #333; font-size: 14px; font-weight: 500;">${data.service}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 14px 0; border-bottom: 1px solid #eee;">
                              <span style="color: #888; font-size: 13px;">Company</span>
                            </td>
                            <td style="padding: 14px 0; border-bottom: 1px solid #eee; text-align: right;">
                              <span style="color: #333; font-size: 14px; font-weight: 500;">${data.company}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 14px 0;">
                              <span style="color: #888; font-size: 13px;">Message</span>
                            </td>
                            <td style="padding: 14px 0; text-align: right;">
                              <span style="color: #333; font-size: 14px; font-weight: 500;">${data.message}</span>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- Signature -->
                      <div style="margin-top: 36px; text-align: center;">
                        <p style="color: #888; font-size: 14px; margin: 0;">Best regards,</p>
                        <p style="color: #333; font-size: 15px; font-weight: 600; margin: 6px 0 0;">The My Customs Team</p>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Contact Section -->
                  <tr>
                    <td style="padding: 0 40px 36px;">
                      <div style="background: #f0f4f8; border-radius: 12px; padding: 24px; text-align: center;">
                        <p style="color: #555; font-size: 14px; margin: 0 0 16px;">
                          Have questions? Feel free to reach out anytime.
                        </p>
                        <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                          <tr>
                            <td style="padding-right: 24px;">
                              <table role="presentation" cellspacing="0" cellpadding="0">
                                <tr>
                                  <td style="background: #fff; border-radius: 50%; width: 32px; height: 32px; text-align: center; vertical-align: middle;">
                                    <span style="color: #3871C1; font-size: 14px;">✉</span>
                                  </td>
                                  <td style="padding-left: 10px;">
                                    <a href="mailto:${reachOutEmail}" style="color: #3871C1; font-size: 13px; text-decoration: none;">${reachOutEmail}</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td>
                              <table role="presentation" cellspacing="0" cellpadding="0">
                                <tr>
                                  <td style="background: #fff; border-radius: 50%; width: 32px; height: 32px; text-align: center; vertical-align: middle;">
                                    <span style="color: #3871C1; font-size: 14px;">✆</span>
                                  </td>
                                  <td style="padding-left: 10px;">
                                    <a href="tel:${reachOutPhone}" style="color: #3871C1; font-size: 13px; text-decoration: none;">${reachOutPhone}</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: #111A2E; padding: 28px 40px; text-align: center;">
                      <p style="color: #fff; font-size: 14px; font-weight: 500; margin: 0 0 6px;">My Customs</p>
                      <p style="color: #888; font-size: 11px; margin: 0;">© ${currentYear} My Customs. All rights reserved.</p>
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
  const siteUrl = process.env.SITE_URL || "https://mycustoms-website.vercel.app";
  const logoUrl = `${siteUrl}/images/email-logo-white.png`;
  const currentYear = new Date().getFullYear();

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
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f0f0;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f0f0f0; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background: #ffffff; border-radius: 12px; overflow: hidden;">
                  
                  <!-- Header with Logo -->
                  <tr>
                    <td style="background: #2B7FFF; padding: 20px 40px 40px; text-align: center;">
                      <img src="${logoUrl}" alt="My Customs" width="120" style="display: block; margin: 0 auto 24px;">
                      <p style="color: rgba(255,255,255,0.9); font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">New Enquiry</p>
                      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 500;">Contact Form Submission</h1>
                    </td>
                  </tr>
                  
                  <!-- Contact Details -->
                  <tr>
                    <td style="padding: 40px 40px 32px;">
                      <p style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 16px;">Contact Details</p>
                      
                      <div style="background: #f8f9fa; border-radius: 12px; padding: 4px 20px;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                          <tr>
                            <td style="padding: 14px 0; border-bottom: 1px solid #eee;">
                              <span style="color: #888; font-size: 13px;">Name</span>
                            </td>
                            <td style="padding: 14px 0; border-bottom: 1px solid #eee; text-align: right;">
                              <span style="color: #333; font-size: 14px; font-weight: 500;">${data.name}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 14px 0; border-bottom: 1px solid #eee;">
                              <span style="color: #888; font-size: 13px;">Company</span>
                            </td>
                            <td style="padding: 14px 0; border-bottom: 1px solid #eee; text-align: right;">
                              <span style="color: #333; font-size: 14px; font-weight: 500;">${data.company}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 14px 0; border-bottom: 1px solid #eee;">
                              <span style="color: #888; font-size: 13px;">Email</span>
                            </td>
                            <td style="padding: 14px 0; border-bottom: 1px solid #eee; text-align: right;">
                              <a href="mailto:${data.email}" style="color: #3871C1; font-size: 14px; text-decoration: none; font-weight: 500;">${data.email}</a>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 14px 0; border-bottom: 1px solid #eee;">
                              <span style="color: #888; font-size: 13px;">Phone</span>
                            </td>
                            <td style="padding: 14px 0; border-bottom: 1px solid #eee; text-align: right;">
                              <a href="tel:${data.phone}" style="color: #3871C1; font-size: 14px; text-decoration: none; font-weight: 500;">${data.phone}</a>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 14px 0; border-bottom: 1px solid #eee;">
                              <span style="color: #888; font-size: 13px;">Service</span>
                            </td>
                            <td style="padding: 14px 0; border-bottom: 1px solid #eee; text-align: right;">
                              <span style="color: #333; font-size: 14px; font-weight: 500;">${data.service}</span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 14px 0;">
                              <span style="color: #888; font-size: 13px;">Message</span>
                            </td>
                            <td style="padding: 14px 0; text-align: right;">
                              <span style="color: #333; font-size: 14px; font-weight: 500;">${data.message}</span>
                            </td>
                          </tr>
                        </table>
                      </div>
                      
                      <!-- CTA -->
                      <div style="margin-top: 32px; text-align: center;">
                        <a href="mailto:${data.email}" style="display: inline-block; background: #3871C1; color: white; padding: 14px 36px; text-decoration: none; border-radius: 50px; font-weight: 500; font-size: 14px;">
                          Reply to Customer
                        </a>
                      </div>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background: #111A2E; padding: 28px 40px; text-align: center;">
                      <p style="color: #fff; font-size: 14px; font-weight: 500; margin: 0 0 6px;">My Customs</p>
                      <p style="color: #888; font-size: 11px; margin: 0;">© ${currentYear} My Customs. All rights reserved.</p>
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
