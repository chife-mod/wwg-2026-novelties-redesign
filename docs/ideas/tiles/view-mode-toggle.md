# View-mode toggle — Count · %

**Problem.** Плитки на Current-view показывали только абсолютные числа
(Rolex 58 novelties, $5-10K bucket = 102). Для аналитики watch-fair
хочется и то, и другое — в абсолюте видно масштаб, в долях видно
распределение. Клиент (PM) попросил переключатель с дефолтом в «Count».

**Tried.**

1. **Segmented control с двумя отдельными кнопками** (initial). Две
   independent buttons, click по активной — ничего не делает. Работало,
   но в user-test выяснилось: пользователь жал «куда попало» и не попадал
   в неактивный сегмент. Надо было «целиться». ✗

2. **Single button role="switch", клик флипает mode** (current). Вся
   капсула — одна кнопка. Клик в любую точку переключает mode на
   противоположный. Два сегмента остались, но они чисто визуальные —
   показывают state, не принимают click'и отдельно. ✓ **selected.**

3. **Toggle switch (iOS-style)** — отклонён. Требует мысленного усилия
   «а что сейчас активно». Segmented показывает оба состояния
   одновременно, сразу видно где currently.

4. **Labels.**
   - `Numbers · Percent` — слишком длинно, тег-строка разъезжалась.
   - `Count · Percent` — грамматически правильно, но «Percent» визуально
     тяжёлый и дублирует «Count» по длине → глаз не сразу ловит, кто
     активен.
   - **`Count · %`** — ✓ выбрано. Активный label словом («Count»),
     символом («%») — когда активен первый, пользователь видит контекст
     («вот Count»); когда второй — «%» на paper-плашке сам по себе
     очевиден.

5. **Hover-affordance.** Исходно транзиция была только на активном
   сегменте. Hover не давал сигнала «это интерактив». Добавил:
   (a) вся капсула темнеет `bg-black/40 → bg-black/60`,
   (b) неактивный сегмент высветляется `text-mute-2 → text-paper`
       через `group-hover`.

**Decision.** Single `<button role="switch">`, клик куда угодно
флипает. Labels `Count · %`. Hover-подсветка капсулы + неактивного
сегмента. Размещение — правый край top-strip, прижат через `justify-end`
к краю `max-w-[1440px]` контейнера (балансирует теги слева).

**Архитектура state.**
- `ViewModeContext` (`src/components/ViewModeContext.tsx`) — крошечный
  React-контекст с `mode: 'count' | 'pct'`. Provider обёрнут вокруг
  всего App в `App.tsx`.
- `useFormatCount()` helper в `common.tsx`:
  ```ts
  const fmt = useFormatCount()
  // ...
  {fmt(b.count)}         // default total = TOTAL_NOVELTIES (478)
  {fmt(bucket, priceTotal)} // override total for price tile
  ```
  Возвращает либо `'58'`, либо `'12.1%'` (1 знак после запятой для
  мелких бакетов <10%, иначе целое).

**Scope.** Не все тайлы подписаны — только три дефолтных на Current-view:
- `BrandsTileD` (top brands)
- `CollectionsTileB` (top collections)
- `PriceTileD` (price ranges, tooltip)

Остальные (Dials, Straps, Diameter, Functions, Materials, Heights,
Movement, Editions) опт-инят через тот же `useFormatCount` — это
2-строчное изменение на тайл. Подключим в следующей итерации.

**Что намеренно НЕ переключается:**
- Hero 4-метрики (`61 / 478 / 61 / 26`) — это totals, они и так 100%.
- YoY-дельты (`+5%`, `-7%`) — уже проценты.

**Notes.**
- `role="switch" aria-checked={mode === 'pct'}` — правильная ARIA-семантика
  для 2-state toggle. Screen reader'ы проговаривают «on/off» корректно.
- Fix по ходу: `BrandLogo` резолвил абсолютные пути `/assets/logos/...`,
  что ломалось на GH Pages (сайт под `/wwg-2026-novelties-redesign/`).
  Переписал на `${import.meta.env.BASE_URL}assets/logos/${file}` — Vite
  подставляет правильный префикс для каждой среды. Логотипы вернулись.
