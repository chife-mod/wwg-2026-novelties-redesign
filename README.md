# WWG 2026 Novelties — Page Redesign

Прототип альтернативной подачи страницы [Watch360 · Watches & Wonders Geneva 2026 Novelties](https://watch360.ch/analytics/watch-fairs/watches-and-wonders-2026/novelties). Цель — показать альтернативу бесконечным бар-чартам на live-странице: внятная иерархия, фотографии часов, визуальные приёмы вместо ranked-list.

## Стэк

Vite + React 18 + TypeScript + TailwindCSS 3. Lato — единственный шрифт. Gold + Paper White как в дизайн-системе Watch360.

## Локальный запуск

```bash
cd prototype
npm install
npm run dev
```

## Структура

- `prototype/` — Vite-проект, вся верстка живёт здесь.
- `docs/plans/` — design-doc V1 (архитектура страницы).
- `docs/ideas/` — лог идей по ходу работы.
- `CLAUDE.md` — проектная память для работы с Claude.

## Деплой

Собирается и публикуется на GitHub Pages через Actions (см. `.github/workflows/deploy.yml`) на каждый push в `main`.
