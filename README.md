# Nuxt Starter Template

A starter kit for getting up and running with a full-stack Nuxt application in no time.

> [!NOTE]
> This project is a work in progress, the main branch is still considered under development, will create a `v1.0.0` tag once ready

### Features

-   **User authentication** - Email and password sign-up/login, email verification, account settings, middleware protection for client and server routes & pages
-   **Database** - Pre-configured connection util, Drizzle ORM with provided schema & migration scripts (PostgreSQL)
-   **Email** - SMTP powered mailer with Vue SFC enabled templating, transactional email template (for auth related mail)
-   **Server Logs** - Server-side logging util, nitro-related server errors automatically logged via plugin, log file rotation
-   **Client-side error handling** - Nuxt app plugin for ofetch/`$fetch()` configuration settings providing error handling based on request/response status code and authentication - toast message, auto login redirect with failed auth on protected api routes, etc.

### Tech Stack

-   [Nuxt UI](https://ui.nuxt.com)
-   [Better Auth](https://www.better-auth.com/)
-   [Drizzle ORM](https://orm.drizzle.team/)
-   [Nodemailer](https://nodemailer.com/)
-   [Vue Email](https://vuemail.net/)
-   [Winston Logger](https://github.com/winstonjs/winston)
-   [Zod Schema Validation](https://zod.dev/)

### Setup

#### Environment Variables
**Unix/Mac**
```shell
cp .env.example .env
```

**Windows**
```shell
copy .env.example .env
```

> [!IMPORTANT]
> Make sure to configure the `NUXT_BETTER_AUTH_SECRET` value with a secure key, it is used for encryption and hashing. It must be at least 32 characters and generated with high entropy.

#### Database

Generate & Migrate DB tables using Drizzle:

```shell
npm run db:generate
npm run db:migrate
```
