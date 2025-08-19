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

