# Mighty Meats and Deli

Сайт мясной лавки с админкой. Структура повторяет [mightymeatsanddeli.com](https://mightymeatsanddeli.com/about/), визуальный ориентир — [Liam's Quality Meats](https://butcher.webflow.io).

Всё работает на бесплатных тарифах.

```
                 правки в админке
   Редактор ───────────────────────►  CMS (Payload)  ── Render, free
                                        │   │
                        Postgres ◄──────┘   └──────► Supabase Storage (картинки)
                        Supabase, free                        ▲
                                        │ deploy hook          │ картинки напрямую
                                        ▼                      │
   Посетитель ◄──── статический HTML ── Cloudflare Pages ──────┘
```

- **apps/cms** — Payload CMS 3 на Next.js: админка `/admin` и REST API. Хостинг Render (free).
- **apps/web** — публичный сайт. Next.js собирает его в статический HTML (`output: 'export'`) из данных CMS; хостинг Cloudflare Pages.
- **packages/shared** — общий код: типы Payload (генерируются из CMS), константы, парсер видео-ссылок.

Почему так:

- Посетители получают готовый HTML с CDN Cloudflare. Сайт быстрый, хорошо индексируется и не зависит от того, спит ли CMS.
- Бесплатный Render усыпляет сервер после 15 минут простоя, первое обращение будит его примерно за минуту. Это касается только админки и формы обратной связи.
- Картинки отдаются прямо из Supabase Storage, без участия CMS.
- После сохранения в админке CMS через минуту вызывает deploy hook Cloudflare Pages, сайт пересобирается (1–2 минуты). Несколько правок подряд объединяются в одну сборку.

## Страницы и блоки

| Страница             | URL                   | Блоки по умолчанию (seed)                         |
| -------------------- | --------------------- | ------------------------------------------------- |
| Home                 | `/`                   | Hero, Content, Steps, Testimonials, Location      |
| About                | `/about`              | Content                                           |
| Products             | `/products`           | Product list, Partner list                        |
| Freezer & Bulk Packs | `/freezer-bulk-packs` | Product list + примечание про 24 часа             |
| Contact              | `/contact`            | Contact form, Location                            |

Блоки в админке: `hero`, `content`, `steps` (шаги 1-2-3 с рисующейся линией), `featuredProducts` (слайдер «Customer favorites»), `gallery`, `videoGallery`, `productList`, `partnerList`, `testimonials`, `contactForm`, `location`.

Анимации: заголовки появляются по буквам, текст и картинки проявляются при прокрутке, линия между шагами рисуется вслед за прокруткой. Без JavaScript всё видно сразу; при системной настройке «уменьшить движение» анимации отключаются.

## Локальный запуск

Нужны Node 22, pnpm 10 и Docker.

```bash
pnpm install
pnpm db:up                                   # Postgres в Docker на порту 54322
cp apps/cms/.env.example apps/cms/.env       # заполнить PAYLOAD_SECRET: openssl rand -hex 32
cp apps/web/.env.example apps/web/.env.local
pnpm --filter @mighty-meats/cms migrate
pnpm --filter @mighty-meats/cms seed       # страницы, меню, категории
pnpm dev                                     # CMS: http://localhost:3001/admin, сайт: http://localhost:3000
```

Первого администратора создаёте сами на `/admin`. Без настроек S3 файлы сохраняются локально в `apps/cms/media`.

Статическая сборка сайта (CMS должна быть запущена):

```bash
pnpm --filter @mighty-meats/web build      # результат в apps/web/out
pnpm --filter @mighty-meats/web preview
```

## Проверки

```bash
pnpm typecheck
pnpm lint
pnpm test        # парсер видео-ссылок, форма обратной связи, коллекция Videos (нужен запущенный Postgres)
```

После изменения коллекций или блоков:

```bash
pnpm --filter @mighty-meats/cms migrate:create <name>
pnpm --filter @mighty-meats/cms generate:types
pnpm --filter @mighty-meats/cms generate:importmap
```

## Деплой

### 1. Supabase — база и файлы

1. Проект: `qnfnuibrhtezkamsbafu`, регион Canada (Central) `ca-central-1`. Render ставим в ближайший регион, Virginia.
2. **База:** Project Settings → Database → Connection string → **Session pooler** (порт 5432). Это `DATABASE_URL`. Прямое подключение у Supabase работает только по IPv6, а Render ходит по IPv4, поэтому нужен именно pooler (Supavisor — прокси Supabase перед Postgres).
3. **Файлы:** Storage → New bucket `media`, **Public**. Storage → Settings → S3 Connection: endpoint и регион; там же создать S3 Access Keys.

### 2. Render — CMS

1. New → Blueprint → этот репозиторий (читается `render.yaml`).
2. Заполнить переменные: `DATABASE_URL`, `S3_*`, `WEB_URL` (адрес сайта), `WEB_DEPLOY_HOOK_URL` (после шага 3). Свой адрес сервис берёт из `RENDER_EXTERNAL_URL`, его Render задаёт сам.
3. Миграции применяются сами при старте.

### 3. Cloudflare Pages — сайт

1. Workers & Pages → Create → Pages → Connect to Git → этот репозиторий.
2. Build command: `pnpm --filter @mighty-meats/web build`, output directory: `apps/web/out`.
3. Переменные: `NODE_VERSION=22.23.2`, `PNPM_VERSION=10.34.5`. Адреса CMS и сайта (`CMS_URL`, `NEXT_PUBLIC_CMS_URL`, `NEXT_PUBLIC_SITE_URL`) лежат в `apps/web/.env.production`: они публичные, а переменные из панели Cloudflare до `next build` не доходили. Переменная, заданная в окружении сборки, по-прежнему важнее файла.
4. Settings → Builds → Deploy hooks → создать hook, его URL прописать в Render как `WEB_DEPLOY_HOOK_URL`.

### 4. GitHub — чтобы Supabase не засыпал

Бесплатный проект Supabase ставится на паузу после 7 дней без запросов. Workflow `.github/workflows/keep-alive.yml` раз в 3 дня дёргает `/api/health`. Нужно задать переменную репозитория `CMS_URL` (Settings → Secrets and variables → Actions → Variables).

### 5. YouTube-канал для блока Ideas (когда появится)

Блок Ideas умеет показывать последние ролики канала магазина (Shorts — вертикально). Ключи API не нужны: сайт при сборке читает открытую RSS-ленту канала (до 15 последних роликов).

1. Админка → **Site Settings → Social → YouTube channel**: ссылка вида `https://www.youtube.com/@name`.
2. Админка → **Pages → Home → блок Ideas → Source**: «Latest videos from the YouTube channel», при желании поменять количество.
3. Чтобы новые ролики появлялись сами: GitHub → Settings → Secrets and variables → Actions → **Secrets** → `CF_PAGES_DEPLOY_HOOK` = ссылка deploy hook из Cloudflare. Workflow `daily-rebuild.yml` пересобирает сайт каждый день в 06:00 по Виннипегу.

Пока на канале нет роликов или он недоступен, блок показывает видео, выбранные вручную.

### Ограничения бесплатных тарифов

| Сервис           | Лимит                                                   |
| ---------------- | ------------------------------------------------------- |
| Render           | 512 МБ RAM (CMS занимает ~260 МБ), сон после 15 мин     |
| Supabase         | 500 МБ база, 1 ГБ файлы, пауза после 7 дней простоя     |
| Cloudflare Pages | 500 сборок в месяц, трафик без ограничений              |

Видео лучше давать ссылками на YouTube и т. п.: 1 ГБ хранилища быстро кончится на своих роликах.
