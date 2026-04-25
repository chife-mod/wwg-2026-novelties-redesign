# CLAUDE.md — WWG 2026 Novelties Page Redesign

Project memory for Claude. Read first in every new session.

## Context

Watch360 — premium аналитическая платформа по часовому рынку. У неё есть живая страница
`/analytics/watch-fairs/watches-and-wonders-2026/novelties`, которая **сейчас выглядит
уныло**: 11 одинаковых белых плиток с топ-10 бар-чартами, никакой иерархии, никакого
«вайба» выставки. Задача — переизобрести эту страницу как минимум в одной версии, чтобы
показать пользователю (PM/дизайнер Олег, part-time в проекте) альтернативную подачу.

## User profile

- Олег — part-time продуктовый дизайнер Watch360, богатый визуальный вкус, не любит
  «бар-чарт-болото».
- Хочет «вау с первого экрана + портфолио-стоящую работу».
- Русскоязычный; отвечать по-русски. Технический жаргон — английский.
- Любит конкретику и результат, не любит длинных абстрактных рассуждений. Лучше
  показать — потом обсудить.
- Санкционировал: плейсхолдеры вместо реальных фото часов; приблизительные числа если
  точные данные сложно извлечь; новые типы визуализаций, не только существующие
  паттерны из дизайн-системы.

## Deliverable

Локальный прототип с версионностью — несколько альтернативных подач одной и той же
страницы. Смотрим в браузере, сравниваем с оригиналом.

**Стратегия:** строим по одной версии за раз, разбираем, потом следующая. НЕ три
параллельно (выжигает токены, сложно править).

**Текущее состояние (2026-04-25):** пять вариантов на одном прототипе, переключаются hash-роутингом и top-strip свитчером. Дефолт по загрузке = V5 (новейшая, leftmost).

| Slug | Что | Code dir |
|------|-----|----------|
| `/v1` | Editorial Report (исходная cover-story) | `components/` (top-level) |
| `/v2` | The Window — hero-slider + sticky-collection rail | `components/V2RightGrid.tsx` |
| `/v3` | Current — canonical tile-variant sandbox page | `components/current/` |
| `/v4` | Editorial+ — heatmap MarketMap + bespoke viz | `components/v4/` |
| `/v5` | V3 + Price slot заменён на MarketMap, левая часть с brand-dropdown | `components/v5/` |

VersionSwitcher показывает их в обратном порядке: `[V5] [V4] [V3] [V2] [V1]`. Без подписей, без keyboard shortcuts (sняты — никто не использовал).

## Stack

- Vite + React 18 + TypeScript
- TailwindCSS 3 (design tokens в `prototype/tailwind.config.js`)
- Lato (Google Fonts) для UI, Cormorant Garamond — для редакторских заголовков
- Без chart-библиотек: все визуализации руками на SVG/CSS (их немного, они штучные)

## Directory layout

```
.
├── CLAUDE.md                   # этот файл
├── MINIO_WORKFLOW.md           # как забирать лого/фото из корп. MinIO (Quick Start +
│                               # список антипаттернов — читать перед тем, как что-то
│                               # делать с MinIO)
├── .env.local                  # MINIO_USER/MINIO_PASS (не в git)
├── cookies.txt                 # свежий session-token (генерится refresh_cookies.cjs, не в git)
├── scripts/
│   ├── refresh_cookies.cjs     # POST /api/v1/login → свежий cookies.txt. zero-deps Node.
│   └── download_logos.cjs      # читает cookies.txt → качает SVG/PNG → пишет manifest
├── HTML/                       # скопированная оригинальная страница + её ассеты
├── docs/
│   ├── plans/
│   │   └── 2026-04-20-wwg-novelties-redesign-design.md   # design-doc V1
│   ├── principles/             # рабочие правила проекта
│   │   └── design-first-plus-decision-log.md
│   └── ideas/
│       ├── README.md           # индекс идей
│       ├── NN/                 # каждая концепция-идея — своя папка
│       │   ├── NN.md
│       │   └── ref-*.png       # референсные скриншоты
│       └── tiles/              # decision log'и на уровне тайл-вариантов
│           ├── README.md
│           └── <tile-id>.md    # пишется ПОСЛЕ выбора победителя
└── prototype/                  # Vite-проект
    ├── public/
    │   └── assets/
    │       └── logos/           # SVG логотипов брендов (живые из MinIO)
    ├── src/
    │   ├── App.tsx
    │   ├── data.ts             # все числа и категории
    │   ├── index.css           # Tailwind + fonts
    │   ├── assets/
    │   │   └── logos-manifest.json  # «Brand name → файл» для BrandLogo
    │   └── components/
    │       ├── common.tsx      # Eyebrow, DeltaChip, WatchPlaceholder,
    │       │                   # BrandMonogram (fallback), BrandLogo (из manifest)
    │       ├── Nav.tsx
    │       ├── HeroStrip.tsx
    │       ├── HeadlineInsights.tsx
    │       ├── TopList.tsx
    │       ├── PriceCurve.tsx
    │       ├── DialPalette.tsx
    │       ├── DiameterRuler.tsx
    │       ├── ByTheNumbers.tsx
    │       └── FooterStrip.tsx
    └── tailwind.config.js
```

## Design tokens (из Figma, см. design-doc)

```
Gold        #A98155    — основной акцент
Light Gold  #D49E64    — hover/highlight
Brown       #8B6337
Ink         #3A3935    — основной текст
Ink Deep    #1E1D19    — тёмные плашки
Paper       #EEEDEC    — фон страницы
White       #FFFFFF    — фон карточек
Mute        #C6C6C6
Mute 2      #979797
Mute 3      #7B7B7A    — secondary text
Success     #01928D    — positive delta
Error       #F94E56    — negative delta

Fonts: Lato (400, 500, 700). H4 24/1.3. Tag 10/12/14. Cormorant Garamond — editorial.
```

Tailwind-классы: `text-gold`, `bg-ink-deep`, `text-paper`, `bg-success/15` и т.д.

## Working principles

- **Design-First + Decision Log** для визуальных гипотез (тайл-варианты, микро-эксперименты).
  Гипотеза в чате → 2-3 варианта в коде → ревью в sandbox → выбор победителя →
  retrospective decision log в `docs/ideas/tiles/<tile-id>.md`. Документ пишется
  **после** выбора, не до. Подробнее — `docs/principles/design-first-plus-decision-log.md`.
- **Проигравшие варианты не удаляем.** В `tileRegistry.tsx` помечаем `archived: true`
  с однострочным rationale. Остаются видны в sandbox, но не рендерятся на главной.
- **Document-First остаётся** для уровня плана версии (`docs/plans/`) и концепции-идеи
  (`docs/ideas/NN/`). Decision logs живут уровнем ниже.
- **Component consistency** — утверждённый визуальный приём живёт в `common.tsx`
  (DeltaChip, DeltaChipPct, BrandLogo, Eyebrow, SectionTitle), тайлы импортируют.
  Утверждённый паттерн верстки — отдельным md в `docs/principles/` (list-tile-row-pattern,
  и т.д.). Никаких локальных копий «почти такого же компонента», никаких «почти такого же
  паттерна в другой плитке». Меняем — меняем везде. Подробнее — `docs/principles/component-consistency.md`.

## Key decisions so far

1. **Три версии = три редакционных угла, не три визуальных темы.** Эстетика из Figma во
   всех версиях одна.
2. **V1 — "Editorial Cover Story".** Tier 1 визуально богатый hero (топ-бренды,
   топ-коллекции), Tier 2 — Price / Dial / Diameter как инфографика, Tier 3 —
   компактный ряд из 6 маленьких карточек (Materials/Functions/Straps/Heights/Movements/Editions).
3. **Данные — плейсхолдеры** с правдоподобной формой распределения. Извлечены из
   скриншотов оригинальной страницы. См. `prototype/src/data.ts`.
4. **Фото часов — плейсхолдеры** (круглая рамка с монограммой). Реальные рендеры
   придут позже. Реальные лого брендов уже скачаны (`prototype/public/assets/logos/` +
   `prototype/src/assets/logos-manifest.json`). Когда понадобится дотянуть ещё ассеты —
   читать `MINIO_WORKFLOW.md` в корне и запустить
   `node scripts/refresh_cookies.cjs && node scripts/download_logos.cjs`. Полностью
   автономно, без DevTools и без ручных экспортов — при условии что `.env.local` с
   `MINIO_USER`/`MINIO_PASS` лежит в корне (в `.gitignore`).
5. **Нет drill-down, нет фильтров в V1.** Отчёт, не дашборд. Hover-highlight ok.
6. **Новые типы визуализаций разрешены.** Не ограничиваемся существующими
   паттернами Watch360.

## Идеи в работе

- **01 — «Окно в выставку» + слайдер топ-моделей** (`docs/ideas/01/01.md`). Заменяет
  Tier 1 в V1. Левая половина — видеообои/лайв выставки, правая — слайдер топ-10 моделей
  с полным карточным описанием (фото, лого, reference, цена, теги). Принята, ждёт
  реализации.

## Как продолжать работу в новой сессии

1. Прочесть `docs/plans/2026-04-20-wwg-novelties-redesign-design.md` — архитектура V1.
2. Прочесть `docs/ideas/README.md` + все идеи — свежие решения, которые могут
   переопределять design-doc.
3. Проверить статус V1: `cd prototype && npm run dev` → открыть `localhost:5173`.
4. Рабочий цикл: изменения → показать пользователю в браузере → обсудить → итерация.
5. Большие решения фиксировать новой идеей в `docs/ideas/NN/`.

## Conventions

- Русский — для обсуждения, документов, комментариев к идеям.
- Английский — для кода, имён компонентов, UI-текстов.
- Без эмодзи в коде и документах, если явно не попросили.
- Реальные числа, когда доступны; плейсхолдеры — с пометкой.
- TodoWrite используем для многоэтапных задач. Пользователь видит список.
