import crypto from 'crypto';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thinksuite.in';

export function unsubscribeToken(email: string): string {
  const secret = process.env.CRON_SECRET || 'thinksuite-newsletter';
  return crypto.createHmac('sha256', secret).update(email.toLowerCase()).digest('hex').slice(0, 24);
}

export function unsubscribeUrl(email: string): string {
  const token = unsubscribeToken(email);
  return `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}

function withUnsubscribeFooter(html: string, email: string): string {
  const url = unsubscribeUrl(email);
  const footer = `<div style="padding:20px;text-align:center;font-size:11px;color:#94a3b8;font-family:sans-serif">
    You're receiving this because you subscribed to ThinkSuite AI Pulse.
    <a href="${url}" style="color:#94a3b8;text-decoration:underline">Unsubscribe</a>
  </div>`;
  return html.includes('</body>') ? html.replace('</body>', `${footer}</body>`) : `${html}${footer}`;
}

let _transporter: import('nodemailer').Transporter | null = null;

async function getTransporter() {
  if (_transporter) return _transporter;
  const nodemailer = (await import('nodemailer')).default;

  const host = process.env.EMAIL_SERVER_HOST;
  const port = process.env.EMAIL_SERVER_PORT;
  const user = process.env.EMAIL_SERVER_USER;
  const pass = process.env.EMAIL_SERVER_PASSWORD;
  if (!host || !user || !pass) {
    throw new Error('Email not configured. Set EMAIL_SERVER_HOST/PORT/USER/PASSWORD in .env.local');
  }

  _transporter = nodemailer.createTransport({
    host,
    port: port ? parseInt(port, 10) : 587,
    auth: { user, pass },
  });
  return _transporter;
}

export async function sendNewsletterEmail(to: string, subject: string, html: string, text: string): Promise<void> {
  const transporter = await getTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'ThinkSuite AI Pulse <info@thinksuite.in>',
    to,
    subject,
    html: withUnsubscribeFooter(html, to),
    text: `${text}\n\nUnsubscribe: ${unsubscribeUrl(to)}`,
  });
}
