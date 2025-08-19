# EntraDa

Simple Next.js app with authentication (signup, login, logout, password recovery) using Prisma and PostgreSQL. Everything is written in TypeScript and styled with Tailwind CSS.

## Scripts

- `npm run dev` – start development server
- `npm run build` – build application
- `npm start` – start production server

Set a `DATABASE_URL` environment variable pointing to your PostgreSQL instance before running Prisma commands.

## Vercel + Neon setup

To deploy on Vercel with a Neon PostgreSQL database, set the `DATABASE_URL` environment variable in your Vercel project to the following connection string:

```
postgresql://neondb_owner:npg_uyIHSB8OYlC5@ep-still-glade-acdx8v5z-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

For local development, copy `.env.example` to `.env`:

```
cp .env.example .env
```

This ensures Prisma connects to the Neon instance both locally and in production.

## Email sending

Password recovery emails are sent through the [Resend](https://resend.com) API. To enable this feature set the following environment variables in Vercel or your local `.env` file:

- `RESEND_API_KEY` – your Resend API key
- `RESEND_FROM` – (optional) the email address used in the `from` field

If `RESEND_API_KEY` is not provided, the application will skip sending emails.

Email templates for welcome, verification, and password recovery messages are available in English and Spanish. The password recovery endpoint accepts an optional `lang` field (`en` or `es`) to select the language of the email.
