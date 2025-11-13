import { Resend } from 'resend';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400"
        }
      });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    try {
      const body = await request.json();

      // TEMP test — remove later
      console.log("CF EMAIL API HIT:", body);

      const { to, subject, title, excerpt, featuredImage, url: blogUrl } = body;

      // Validate required fields
      if (!to || !title || !excerpt || !blogUrl) {
        return new Response(JSON.stringify({
          error: 'Missing required fields: to, title, excerpt, url'
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }

      // Check if Resend API key is configured
      if (!env.RESEND_API_KEY) {
        return new Response(JSON.stringify({
          error: 'Email service not configured'
        }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }

      const resend = new Resend(env.RESEND_API_KEY);

      console.log('📧 Sending email to:', to, 'Subject:', subject || `🧬 ${title}`);

      // Create HTML email template
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px 40px; text-align: center; background: linear-gradient(135deg, #0B593E 0%, #22c55e 100%); border-radius: 12px 12px 0 0;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">🧬 Biovance</h1>
                        <p style="color: #e8f5e8; margin: 8px 0 0 0; font-size: 16px;">Exploring the Intelligence of Nature</p>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        ${featuredImage ? `
                          <div style="text-align: center; margin-bottom: 30px;">
                            <img src="${featuredImage}" alt="Featured Image" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);" />
                          </div>
                        ` : ''}

                        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 700; line-height: 1.3;">${title}</h2>

                        <div style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                          ${excerpt.replace(/\n/g, '<br>')}
                        </div>

                        <div style="text-align: center; margin: 40px 0;">
                          <a href="${blogUrl}" style="background: linear-gradient(135deg, #0B593E 0%, #22c55e 100%); color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(11, 89, 62, 0.2); transition: all 0.3s ease;">
                            📖 Read Full Blog
                          </a>
                        </div>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f9fafb; border-radius: 0 0 12px 12px; border-top: 1px solid #e5e7eb;">
                        <div style="text-align: center; color: #6b7280; font-size: 14px;">
                          <p style="margin: 0 0 10px 0;">© 2024 Biovance. All rights reserved.</p>
                          <p style="margin: 0; font-size: 12px;">
                            You're receiving this because you're subscribed to our newsletter.
                            <a href="${env.SITE_URL || 'https://biovance-site.pages.dev'}/unsubscribe" style="color: #0B593E; text-decoration: underline;">Unsubscribe</a>
                          </p>
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

      // Send email via Resend
      const result = await resend.emails.send({
        from: 'Biovance <noreply@biovance.com>',
        to: [to],
        subject: subject || `🧬 ${title}`,
        html: htmlContent,
      });

      console.log('✅ Email sent successfully:', result);

      return new Response(JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        result: result
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (err) {
      console.error('💥 Email error:', err);
      return new Response(JSON.stringify({
        ok: false,
        error: String(err)
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
}