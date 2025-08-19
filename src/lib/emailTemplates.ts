export type Locale = 'en' | 'es';

interface EmailContent {
  subject: string;
  html: string;
}

const templates = {
  en: {
    welcome: (name: string): EmailContent => ({
      subject: 'Welcome to EntraDa',
      html: `<p>Welcome, ${name}!</p>`
    }),
    verification: (link: string): EmailContent => ({
      subject: 'Verify your email',
      html: `<p>Please verify your email by clicking <a href="${link}">here</a>.</p>`
    }),
    reset: (token: string): EmailContent => ({
      subject: 'Password Recovery',
      html: `<p>Your password reset token is: <strong>${token}</strong></p>`
    })
  },
  es: {
    welcome: (name: string): EmailContent => ({
      subject: 'Bienvenido a EntraDa',
      html: `<p>¡Bienvenido, ${name}!</p>`
    }),
    verification: (link: string): EmailContent => ({
      subject: 'Verifica tu correo',
      html: `<p>Por favor verifica tu correo haciendo clic <a href="${link}">aquí</a>.</p>`
    }),
    reset: (token: string): EmailContent => ({
      subject: 'Recuperación de contraseña',
      html: `<p>Tu token de restablecimiento es: <strong>${token}</strong></p>`
    })
  }
} as const;

export function buildWelcomeEmail(locale: Locale, name: string): EmailContent {
  const t = templates[locale] || templates.en;
  return t.welcome(name);
}

export function buildVerificationEmail(locale: Locale, link: string): EmailContent {
  const t = templates[locale] || templates.en;
  return t.verification(link);
}

export function buildPasswordResetEmail(locale: Locale, token: string): EmailContent {
  const t = templates[locale] || templates.en;
  return t.reset(token);
}
