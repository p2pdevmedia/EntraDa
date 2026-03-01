# EntraDa

Simple Next.js app with authentication (signup, login, logout, password recovery) and event management. Everything is written in TypeScript and styled with Tailwind CSS.

## Scripts

- `npm run dev` – start development server
- `npm run build` – build application
- `npm start` – start production server
- `npm test` – run API/auth tests

## Data model

This project uses an in-memory store (`src/lib/store.ts`) for users, events, tickets, and ratings. Data is reset when the server restarts.

## Email sending

Password recovery emails are sent through the [Resend](https://resend.com) API. To enable this feature set the following environment variables in Vercel or your local `.env` file:

- `RESEND_API_KEY` – your Resend API key
- `RESEND_FROM` – (optional) the email address used in the `from` field

If `RESEND_API_KEY` is not provided, the application will skip sending emails.

Email templates for welcome, verification, and password recovery messages are available in English and Spanish. The password recovery endpoint accepts an optional `lang` field (`en` or `es`) to select the language of the email.
