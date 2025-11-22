# Nuxt Starter Template

A starter kit for getting up and running with a full-stack Nuxt application.

> [!NOTE]
> This project is a work in progress, the main branch is still considered under development

### Features

-   **User authentication** - Email and password sign-up/registration, email verification, middleware for client and server routes
-   **Database** - Pre-configured connection util, ORM, and migration scripts (PostgreSQL)
-   **Email** - SMTP mailer with Vue SFC templating, transactional email layout (used for auth)
-   **Logging** - Server-side logging utils for info/error details
-   **Client-side error handling** - Nuxt plugin for `$fetch()`/`ofetch` configuration settings with error handling based on request/response status code (toast message, auto login redirect with failed auth protected api routes, etc.)

### Tech Stack

-   [Nuxt UI](https://ui.nuxt.com)
-   [Better Auth](https://www.better-auth.com/)
-   [Drizzle ORM](https://orm.drizzle.team/)
-   [Vue Email](https://vuemail.net/)
-   [Winston Logger](https://github.com/winstonjs/winston)

### Setup

Generate/Migrate DB tables:

```shell
npm run db:generate
npm run db:migrate
```
