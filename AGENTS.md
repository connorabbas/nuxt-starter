# AGENTS.md
Operational guide for coding agents working in this repository.

## 1) Project context
- Stack: Nuxt 4, Vue 3, TypeScript, Nuxt UI v4, Tailwind CSS v4.
- Backend: Nitro server routes with Better Auth.
- Data: Drizzle ORM + PostgreSQL.
- Validation: Zod schemas in `shared/schemas` and server validation helpers.
- Testing: Vitest multi-project config (`unit`, `nuxt`, `e2e`).

## 2) Rule sources (Cursor/Copilot)
- `.cursor/rules/`: not present.
- `.cursorrules`: not present.
- `.github/copilot-instructions.md`: not present.
- Use this file as the primary in-repo agent guidance.

## 3) Install/bootstrap
```bash
npm ci
npm run postinstall
```
Install Playwright browser once per environment:
```bash
npm run test:e2e:install
```

## 4) Build/lint/typecheck commands
```bash
# run dev server
npm run dev

# create production build
npm run build

# preview production build
npm run preview

# lint (script applies --fix)
npm run lint

# Nuxt typecheck
npm run typecheck
```
Notes:
- ESLint config is in `eslint.config.mjs`.
- Formatting rules are lint-enforced (indent, semicolons, quotes, commas, line endings).

## 5) Test commands
Primary scripts from `package.json`:
```bash
# all tests (watch)
npm test

# all tests (single run)
npm run test:run

# coverage
npm run test:coverage

# per project
npm run test:unit
npm run test:integration
npm run test:e2e
```

### Run one file (preferred patterns)
```bash
# unit file
npx vitest run --project unit test/unit/some-feature.test.ts

# nuxt/integration file
npx vitest run --project nuxt test/nuxt/api/form-validation-example.put.test.ts

# e2e file
npx vitest run --project e2e test/e2e/sign-up.verify-required.test.ts
```
Alternative via npm script passthrough:
```bash
npm run test:integration -- test/nuxt/api/auth-mailer-mock.test.ts
```

### Run one test case
```bash
npx vitest run --project nuxt test/nuxt/api/form-validation-example.put.test.ts -t "returns 401"
```

### Test behavior to know
- `vitest.config.ts` sets `fileParallelism: false` and `maxWorkers: 1`.
- This is intentional to avoid race conditions in DB-driven tests.
- Nuxt test setup file: `test/nuxt/setup.ts`.

## 6) Database/auth tooling commands
```bash
# regenerate Better Auth schema file
npm run auth:schema

# generate migration SQL
npm run db:generate

# apply migrations
npm run db:migrate

# seed DB
npm run db:seed
```

## 7) Code style guidelines
Style baseline (from `.editorconfig` + ESLint):
- Indent with 4 spaces.
- Use LF line endings.
- Use single quotes.
- Do not use semicolons.
- Do not use trailing commas.
- Trim trailing whitespace (except markdown).
- Keep final newline at EOF.
General coding expectations:
- Follow existing file-local patterns before introducing new structure.
- Keep diffs focused; avoid unrelated refactors/reformatting.
- Prefer clear and explicit control flow.
- Add comments only for non-obvious logic.

## 8) Imports and module usage
Preferred import grouping:
1. Nuxt/Vue imports (and related types).
2. Third-party libraries.
3. Internal aliases (`~`, `@`, `#shared`, `~~`).
Import conventions:
- Use `import type` for type-only imports.
- Omit file extensions.
- In SFCs, rely on Nuxt auto-imports for composables/utilities when available.

## 9) TypeScript, schemas, and naming
Types:
- Prefer explicit types on exported/public functions.
- Avoid `any` unless truly necessary (lint allows it, but prefer precise types).
- Use Zod for runtime validation of request payloads.
- Reuse shared schemas from `shared/schemas` and extend server-side with `superRefine` when needed.
Naming:
- Variables/functions: `camelCase`.
- Types/interfaces/components: `PascalCase`.
- Composables: `useXxx`.
- File names for DB/API handlers: `kebab-case`.
- API route method suffixes: `*.get.ts`, `*.post.ts`, `*.put.ts`, etc.

## 10) Error handling and security conventions
Server/API:
- Prefer `createError({ status, message, data? })` for expected API errors.
- Convert validation failures to structured 422 responses using Zod validation and the `validateBody()` /server/utils/validation function helper.
- `/api/app/*` is protected by auth middleware; account for session and verification checks.
Client:
- Prefer `$appFetch` from `app/plugins/app-fetch.ts` for API requests.
- `$appFetch` auto-attaches CSRF token and centralizes HTTP error UX.
- For custom clients (for example Better Auth calls), manually send `csrf-token` header.
Logging:
- Use `server/utils/logger.ts` for server-side logs.
- Nitro plugin logs server errors (500+) in `server/plugins/nitro-error-logger.ts`.

## 11) Agent workflow checklist
- Run `npm run lint` after meaningful code edits.
- Run `npm run typecheck` for TS-impacting changes.
- Run targeted tests first (single file / `-t`), then broader suites if needed.
- Do not commit secrets or modify env files unless task explicitly requires it.
