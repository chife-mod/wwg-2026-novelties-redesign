# Top collections

**Problem.** Оригинальная (A) зеркалила Top brands со всеми её проблемами + kicker «LINES», правый метрик-блок «119 ACTIVE» и border-t сверху — лишний chrome, размывал смысл.

**Tried.**
- A (Before · original) — baseline.
- B (gold title, brand logos, bare numbers) — ✓ **selected**. Заголовок gold, убран kicker, убран 119 ACTIVE, убран border-t. Добавил brand-логотипы 32px слева от названия коллекции.

**Decision.** Решение унаследовано от Top brands D: gold-заголовок = eyebrow, голые числа, визуальная плотность строки через grid. Brand-логотипы усиливают маркетинговый wiggle — коллекция без бренда не узнаётся, с брендом становится «Rolex × Datejust».

**Notes.** Использую алиас `Bulgari → Bvlgari` в `BRAND_ALIAS`, чтобы подцепить SVG из manifest'а (в data.ts бренд называется Bulgari, на MinIO файл лежит под Bvlgari).
