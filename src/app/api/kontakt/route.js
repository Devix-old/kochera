import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Simple rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map();

// Rate limiting: max 3 submissions per IP per 15 minutes
function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 3;

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  const record = rateLimitStore.get(ip);

  if (now > record.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize input to prevent XSS
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

export async function POST(request) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedMessage = sanitizeInput(message);

    // Check for minimum length
    if (sanitizedMessage.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long.' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact the administrator.' },
        { status: 500 }
      );
    }

    // Verify Resend is initialized
    if (!resend) {
      return NextResponse.json(
        { error: 'Email service initialization failed.' },
        { status: 500 }
      );
    }

    // Get recipient email from environment or use default
    const recipientEmail = process.env.CONTACT_EMAIL || 'info@kochera.de';
    
    // Get from email (must be verified domain in Resend)
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'kochera <noreply@kochera.de>';
    
    // Send email using Resend
    const emailPayload = {
      from: fromEmail,
      to: recipientEmail,
      replyTo: sanitizedEmail,
      subject: `Kontaktformulär: ${sanitizedSubject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
                color: white;
                padding: 20px;
                border-radius: 8px 8px 0 0;
              }
              .content {
                background: #f9fafb;
                padding: 20px;
                border: 1px solid #e5e7eb;
                border-top: none;
                border-radius: 0 0 8px 8px;
              }
              .field {
                margin-bottom: 15px;
              }
              .label {
                font-weight: bold;
                color: #6b7280;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
              }
              .value {
                color: #111827;
                font-size: 14px;
              }
              .message-box {
                background: white;
                padding: 15px;
                border-left: 4px solid #9333ea;
                margin-top: 10px;
                border-radius: 4px;
              }
              .footer {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                font-size: 12px;
                color: #6b7280;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0;">Nytt meddelande från kontaktformuläret</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Från</div>
                <div class="value">${sanitizedName} (${sanitizedEmail})</div>
              </div>
              <div class="field">
                <div class="label">Ämne</div>
                <div class="value">${sanitizedSubject}</div>
              </div>
              <div class="field">
                <div class="label">Meddelande</div>
                <div class="message-box">
                  ${sanitizedMessage.replace(/\n/g, '<br>')}
                </div>
              </div>
            </div>
            <div class="footer">
              <p>Diese Nachricht wurde über das Kontaktformular auf kochera.de gesendet</p>
              <p>Sie können direkt auf diese E-Mail antworten, um ${sanitizedName} zu kontaktieren.</p>
            </div>
          </body>
        </html>
      `,
      text: `
Neue Nachricht vom Kontaktformular

Von: ${sanitizedName} (${sanitizedEmail})
Betreff: ${sanitizedSubject}

Nachricht:
${sanitizedMessage}

---
Diese Nachricht wurde über das Kontaktformular auf kochera.de gesendet
      `.trim(),
    };

    const { data, error } = await resend.emails.send(emailPayload);

    if (error) {
      // Log error for server monitoring (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.error('Resend API error:', error.message);
      }

      // Provide user-friendly error message
      let errorMessage = 'Failed to send email. Please try again later.';
      if (error.message?.includes('Invalid API key')) {
        errorMessage = 'Email service configuration error.';
      } else if (error.message?.includes('domain') || error.message?.includes('not verified')) {
        errorMessage = 'Email service configuration error. Please contact the administrator.';
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    // Send auto-reply confirmation email to the user
    try {
      // Use info@kochera.de for auto-reply (not noreply)
      const confirmationFromEmail = 'kochera <info@kochera.de>';
      
      await resend.emails.send({
        from: confirmationFromEmail,
        to: sanitizedEmail,
        subject: `Tack för ditt meddelande - ${sanitizedSubject}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
                  color: white;
                  padding: 30px 20px;
                  border-radius: 8px 8px 0 0;
                  text-align: center;
                }
                .content {
                  background: #f9fafb;
                  padding: 30px 20px;
                  border: 1px solid #e5e7eb;
                  border-top: none;
                  border-radius: 0 0 8px 8px;
                }
                .message-box {
                  background: white;
                  padding: 20px;
                  border-left: 4px solid #9333ea;
                  margin: 20px 0;
                  border-radius: 4px;
                }
                .footer {
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #e5e7eb;
                  font-size: 12px;
                  color: #6b7280;
                  text-align: center;
                }
                .highlight {
                  color: #9333ea;
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <h1 style="margin: 0; font-size: 24px;">Vielen Dank für Ihre Nachricht!</h1>
              </div>
              <div class="content">
                <p>Hallo ${sanitizedName},</p>
                
                <p>Vielen Dank, dass Sie uns bei kochera kontaktiert haben! Wir haben Ihre Nachricht erhalten und werden uns so schnell wie möglich bei Ihnen melden.</p>
                
                <div class="message-box">
                  <p style="margin: 0 0 10px 0; font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Ihre Nachricht:</p>
                  <p style="margin: 0; color: #111827;">${sanitizedMessage.replace(/\n/g, '<br>')}</p>
                </div>
                
                <p>Wir antworten normalerweise innerhalb von <span class="highlight">24-48 Stunden</span> an Werktagen.</p>
                
                <p>Mit freundlichen Grüßen,<br><strong>Das Team von kochera</strong></p>
              </div>
              <div class="footer">
                <p>Dies ist eine automatische Bestätigungsnachricht. Sie müssen nicht auf diese E-Mail antworten.</p>
                <p>kochera.de | Deutschlands beste Rezeptsammlung</p>
              </div>
            </body>
          </html>
        `,
        text: `
Vielen Dank für Ihre Nachricht!

Hallo ${sanitizedName},

Vielen Dank, dass Sie uns bei kochera kontaktiert haben! Wir haben Ihre Nachricht erhalten und werden uns so schnell wie möglich bei Ihnen melden.

Ihre Nachricht:
${sanitizedMessage}

Wir antworten normalerweise innerhalb von 24-48 Stunden an Werktagen. Wenn Ihre Frage dringend ist, können Sie uns auch über unsere Social-Media-Kanäle erreichen.

Mit freundlichen Grüßen,
Das Team von kochera

---
Dies ist eine automatische Bestätigungsnachricht. Sie müssen nicht auf diese E-Mail antworten.
kochera.de | Deutschlands beste Rezeptsammlung
        `.trim(),
      });
    } catch (confirmationError) {
      // Silently handle auto-reply failure - main email was sent successfully
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to send confirmation email:', confirmationError.message);
      }
    }

    // Success
    return NextResponse.json(
      { 
        success: true,
        message: 'Your message has been sent successfully!',
        id: data?.id 
      },
      { status: 200 }
    );

  } catch (error) {
    // Log error for server monitoring (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('Contact form error:', error.message);
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

