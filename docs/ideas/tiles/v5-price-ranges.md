# V5 Price Ranges (heatmap variants)

**Date:** 2026-04-25
**Tile:** `v5-price` (occupies the slot where V3 had `PriceTileD`)
**Component:** V4's `MarketMapTile` reused with prop overrides
**Variants live in:** `prototype/src/components/v5/variants/`

## Problem

V3 shipped `PriceTileD` — а 2025/2026 YoY-гистограмма по 11 ценовым корзинам.
Корректная аналитика, но отвечает только на «сколько часов в каждой корзине».
Не отвечает: «кто играет в каком сегменте». Heatmap brand × price-bucket — это
другой вопрос и другой инсайт.

В V4 был построен `MarketMapTile` (12 брендов × 11 buckets) как самостоятельный
flagship под именем «Market map». В V5 решено переиспользовать его в слоте
«Price ranges» — без editorial-ноты, под тем же названием что и в V3, чтобы
оператор страницы видел знакомый header и мог сравнивать.

## Tried (3 итерации в одном sandbox-наборе)

### 1. Compact-with-logos (изначальный V4 default)
Top-12 × 11, row-height 22px, label rail 180px (логотип 18px + полное имя
бренда 12px). Плотная, дорогая по визуальной информации.

**Проблема:** на ширине дашборда `$250K+` и `$500K-1M` вылезают за края своих
колонок — column widths ~37px, текст не помещается. Логотипы съели 60px
горизонтали; brand names тоже короткие в reduced-width.

**Архивировано как secondary variant** (`MarketMapDefault.tsx`, key 'B').
Доступно через sandbox-drill для тех, кому нужна логотипная плотность V4.

### 2. Wider, top-10, без логотипов (выбранный для фронта)
Top-10 brands, row-height 36px, label rail 130px (без логотипа, имя бренда
14px). 60% выше клетки + освобождённые 50px горизонтали → bucket-cells шире,
все ценовые подписи помещаются.

**Trade-off:** общая высота тайла выросла с 400 до 520px. Layout справа просто
опускается вниз, ничего не ломается (col-span-12, нет соседей по строке).

**Promoted to front** (`MarketMapLarge.tsx`, key 'A' = default).

### 3. (отвергнуто) 10 buckets вместо 11
Рассматривалось как способ сделать колонки шире вместо отказа от логотипов.
Отвергнуто: `prices[]` shared между PriceTileD/PriceCurve/всеми вариантами,
урезание данных рушит V1/V3 — too high a cost для косметики V5.

## Decided

**Front:** wider variant (top-10, no logos, 36px rows).
**Sandbox secondary:** compact-with-logos.
**Header:** "Price ranges" (вместо V4 "Market map") — тайл стоит в Price-слоте,
ожидание пользователя — увидеть price-данные.
**Editor's Note:** удалена (не сочетается с V5's no-editorial-overlay подходом —
V5 это «чистый» V3 с одним тайл-свопом, не editorial-перезагрузка).

## Tooltip enhancement (added 2026-04-25)

При hover на ячейку tooltip показывает:
1. `{brand} · {bucket}` — заголовок
2. `{count} novelties · {brandShare}% of {brand} · {bucketShare}% of bucket`
3. **NEW:** `{brand} YoY {±N%}` — отдельная строка через hairline `border-t`,
   uppercase eyebrow, цвет teal/salmon/mute по знаку

Цель — клиент попросил YoY дельту в tooltip (а не в виде badge на тайле):
heatmap уже несёт max-info по площади, дополнительные badge'ы засорят. Brand
delta берётся из `brands` в `data.ts` (Ranked.delta). Bucket-level YoY пока
не показываем — `prices[]` не имеет delta-поля; добавим когда подвезут
2025 сравнение.

## Header click-to-sandbox (общее изменение, повлияло на этот тайл)

`TileShell` переключён с click-anywhere → click-on-header (event delegation
на `<header>`). Для V5 Price Ranges это критично: ячейки heatmap имеют
собственные `onMouseEnter`/`onClick` (highlight, lock), и старая «вся плитка
кликабельна» съедала эти взаимодействия. Теперь header = drill-down,
тело тайла = «живые» интерактивы.

## Key implementation details

`MarketMapTile` теперь принимает 8 props: `title`, `showNote`, `topN`,
`rowHeight`, `showLogos`, `labelRailWidth`, `nameSize`, `minHeight`.
Geometry-зависимый `FloatingTooltip` пересчитан — все хардкоды (180, 22, 11)
заменены на параметры.

Variant-обёртки тонкие: `MarketMapDefault` и `MarketMapLarge` — по 1
React-вызову с фиксированными prop-наборами. Компонент один, поведение одно,
экспонированы только axis-параметры. Никакого дублирования логики.

## Open issues / next iterations

- **Bucket-level YoY** — добавить, как только появится 2025 baseline для
  `prices[]` (или копировать `COUNTS_2025` из PriceTileD).
- **Cell-level YoY** (brand × bucket × год) — отсутствует в данных; самый
  релевантный сигнал, но нечем заполнить. Если W360 даст — расширить tooltip
  до 4-й строки.
- **Mobile** — heatmap collapses badly на narrow viewports. Не в scope V5.
