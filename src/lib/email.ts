import {
  buildPasswordResetEmail,
  buildVerificationEmail,
  buildWelcomeEmail,
  type Locale
} from './emailTemplates';

export async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not set; email not sent');
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || 'onboarding@resend.dev',
      to,
      subject,
      html
    })
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Failed to send email', res.status, text);
    throw new Error('Failed to send email');
  }
}

export async function sendWelcomeEmail(to: string, name: string, locale: Locale) {
  const { subject, html } = buildWelcomeEmail(locale, name);
  await sendEmail(to, subject, html);
}

export async function sendVerificationEmail(to: string, link: string, locale: Locale) {
  const { subject, html } = buildVerificationEmail(locale, link);
  await sendEmail(to, subject, html);
}

export async function sendPasswordResetEmail(to: string, token: string, locale: Locale) {
  const { subject, html } = buildPasswordResetEmail(locale, token);
  await sendEmail(to, subject, html);
}

export type { Locale } from './emailTemplates';

