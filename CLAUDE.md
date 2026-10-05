# Mighty Meats and Deli

Architecture, pages and blocks are described in [README.md](README.md). This file holds the working rules.

## Naming

The project is called only "Mighty Meats and Deli" / `mighty-meats-and-deli`. "Butcher Block" / `butchers-block` was a mistake; never use it.

## Production

| Part | Where | Notes |
| --- | --- | --- |
| Admin + REST API (`apps/cms`) | Render free, https://mighty-meats-cms.onrender.com/admin | **Does not deploy on push.** After every push that touches `apps/cms`, remind the user: Render → mighty-meats-cms → Manual Deploy → Deploy latest commit |
| Database + files | Supabase project `qnfnuibrhtezkamsbafu` (ca-central-1), bucket `media` | |
| Website (`apps/web`) | Cloudflare Pages, https://mighty-meats-and-deli.pages.dev | Static export built from the CMS REST API |

- Rebuild of the website after edits needs `WEB_DEPLOY_HOOK_URL` on Render (not set yet), and `CF_PAGES_DEPLOY_HOOK` in GitHub secrets for `daily-rebuild.yml` (not set yet).
- After Render deploys new schema, the website has to be rebuilt to pick up new fields.
- Production secrets live in `apps/cms/.env.production.local` (git-ignored). Run commands against Supabase with `set -a && . ./.env.production.local && set +a`.
- Secrets and passwords are never sent in chat; the user puts them in env files or GitHub secrets. Accounts are created by the user only.

## Local development

- Postgres in Docker on port 54322, database `mighty_meats` (`pnpm db:up`; start Docker Desktop first).
- Dev servers are started with `.claude/launch.json` (`cms` on 3001, `web` on 3000). They call the Volta node binary directly, because the Volta shim triggers macOS access prompts.
- A local-only admin user is in `apps/cms/.env` (`LOCAL_ADMIN_EMAIL` / `LOCAL_ADMIN_PASSWORD`).
- Restart the CMS dev server after every schema change, otherwise the admin returns 500.

## Schema changes

1. Edit collections/blocks in `apps/cms/src`.
2. `pnpm --filter @mighty-meats/cms migrate:create <name>`; migrations run automatically on Render start (`prodMigrations`).
3. `generate:types` writes `packages/shared/src/payload-types.ts`; commit it.
4. New admin components need `pnpm --filter @mighty-meats/cms generate:importmap`.
5. `pnpm typecheck && pnpm lint` before committing.

## Admin UI

Custom dashboard (`apps/cms/src/components/admin/Dashboard.tsx`) replaces Payload's default one: summary, quick actions, recently edited. Light theme, menu groups Website / Products / Settings / Advanced, Preview buttons open pages on the website (`src/utilities/sitePreview.ts`). Styles are in `src/app/(payload)/custom.scss`.
