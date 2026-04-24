# List-tile row pattern

Принцип верстки строк в list-тайлах (Top brands, Top collections, Functions,
Materials, Heights, Straps, Dials, Movement legends и пр.). Единый паттерн,
применяется БЕЗ ИСКЛЮЧЕНИЙ, иначе между тайлами появляются мелкие расхождения
в выравнивании count/delta, которые особенно заметны при инспекции.

## Rule

Каждая строка — per-row CSS grid на самой `<li>`:

```tsx
<ul className="mt-[30px] space-y-2">
  {list.map((item) => (
    <li
      key={item.key}
      className="grid min-h-[32px] grid-cols-[...] items-center gap-3"
    >
      {/* cells в порядке grid-cols */}
    </li>
  ))}
</ul>
```

**Что это даёт:**
- Единая высота строки 32px (через `min-h-[32px]`) для всех тайлов.
- `items-center` центрирует каждую ячейку по вертикали строки → count и delta
  гарантированно попадают в один y-центр, независимо от того, что в соседних
  ячейках (логотип, name+bar stack, swatch).
- Единый горизонтальный ритм через `gap-3`.

## Anti-pattern: `<li className="contents">`

НЕ используем. Это укладывало всё в один большой grid, колонки синхронизировались
между строками, НО появлялись мелкие визуальные расхождения в alignment
(видны при инспекции: подсветка отступов в DevTools ведёт себя непредсказуемо).
Разница с per-row подходом в том, что cross-row column alignment потеряется
— count-колонка может быть разной ширины в зависимости от числа в строке. Это
нестрашно: `justify-self-end` на count не обязателен, т.к. он правее bar-колонки
`minmax(0, 1fr)` которая и так схлопывается.

## Grid-cols конфигурации

| Тайл              | Cols                                                | Описание              |
|-------------------|-----------------------------------------------------|-----------------------|
| Brands            | `auto_32px_minmax(0,1fr)_auto_auto`                 | rank + logo + name+bar + count + delta |
| Collections       | `auto_32px_minmax(0,1fr)_auto_auto`                 | rank + brand-logo + name+bar + count + delta |
| Functions         | `auto_minmax(0,1fr)_auto_auto`                      | rank + name+bar + count + delta |
| Materials         | `auto_32px_minmax(0,1fr)_auto_auto`                 | rank + swatch + name+bar + count + delta |
| Heights           | `auto_minmax(0,1fr)_auto_auto`                      | rank + name+bar + count + delta |
| Straps            | `auto_minmax(0,1fr)_auto_auto`                      | rank + name+bar + count + delta |
| Dials             | `auto_24px_minmax(0,1fr)_auto_auto`                 | rank + swatch + name+bar + count + delta |
| Movement legends  | `auto_minmax(0,1fr)_auto_auto`                      | chip + name + count + delta |

Ключевое: последние две колонки ВСЕГДА `auto_auto` — count + delta.

## Typography consistency

Для count и delta:
- Count: `<span className="num text-[14px] tabular-nums text-ink">`
- Delta: `<DeltaChip delta={...} />` (общий компонент из `common.tsx`)

Глобально для `.num` класса (в `index.css`):
```css
.num {
  font-feature-settings: 'tnum' on, 'lnum' on;
  line-height: 1;
}
```
`line-height: 1` — чтобы digit визуально сидел в центре своего line-box'а, а
не плавал в верхней части (default browser leading 1.2-1.5 создаёт асимметрию).

DeltaChip имеет `inline-flex items-center leading-none py-1` — симметричное
padding, текст чипа точно в центре своего box'а. Пара count + DeltaChip
через родительский `items-center` на grid-строке — обе в y=16 (центр 32px строки).

## Name+bar stack

Name и bar живут в ОДНОЙ grid-cell'е `minmax(0, 1fr)`:

```tsx
<div className="min-w-0">
  <div className="truncate text-[14px] leading-none text-ink">{name}</div>
  <div className="mt-2 h-[6px] w-full overflow-hidden rounded-[6px] bg-ink/[0.08]">
    <div className="h-full rounded-[6px] bg-ink" style={{ width: `...%` }} />
  </div>
</div>
```

Не выносим bar в отдельную row-grid cell — тогда высота строки скачет, и
цифры визуально прыгают между строками.

## Consistency checklist

Перед коммитом нового list-тайла:
1. `<ul className="mt-[30px] space-y-2">` — ровно так.
2. Каждая `<li>` — `grid min-h-[32px] grid-cols-[...] items-center gap-3`.
3. Count: `text-[14px] tabular-nums`, класс `num` обязателен.
4. Delta: `<DeltaChip delta={...} />` из common.tsx. Локальные копии только
   если нужен custom formatter (например, `%` суффикс), и они ДОЛЖНЫ
   повторять `inline-flex items-center leading-none py-1` pattern.
5. `items-center` на `<li>` — не перекрывать `items-start` или `self-center`
   на потомках.

Нарушения видны глазом при инспекции: отступы DevTools подсвечивают разную
высоту строки, чип сидит выше или ниже цифры, между тайлами бросается
визуальная разница на уровне 1-2 пикселей. Код-ревью такое ловит сразу.
