# EntraDa

Simple Next.js app with authentication (signup, login, logout, password recovery) using Prisma and PostgreSQL. Everything is written in TypeScript.

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
