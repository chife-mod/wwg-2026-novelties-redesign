# MinIO Workflow — скачивание ассетов (логотипы, фото часов)

> Самодостаточный документ для сторонних агентов. Всё, что нужно знать, чтобы выдернуть лого бренда или фото коллекции из бакета `sf-ai` на MinIO `sa.minio-admin.semanticforce.ai`.

---

## ⚡ AGENT QUICK START (скопируй, вставь, запусти)

**Если у тебя новый проект и надо скачать ассеты — вот полный путь:**

```bash
# 1. Скопировать оба скрипта к себе (разовая операция)
mkdir -p scripts
cp <reference-project>/scripts/refresh_cookies.cjs scripts/
cp <reference-project>/scripts/download_logos.cjs  scripts/    # отредактируй список брендов под свой проект

# 2. Положить креды (один раз на проект)
cat > .env.local <<'EOF'
MINIO_BASE=https://sa.minio-admin.semanticforce.ai
MINIO_BUCKET=sf-ai
MINIO_USER=<accessKey>
MINIO_PASS=<secretKey>
EOF
echo -e "\n.env.local\ncookies.txt" >> .gitignore

# 3. Запустить цепочку (идемпотентно, запускай сколько хочешь)
node scripts/refresh_cookies.cjs && node scripts/download_logos.cjs
```

**Что происходит:**
- `refresh_cookies.cjs` бьёт `POST /api/v1/login` с кредами из `.env.local`, достаёт `token` из `Set-Cookie`, пишет свежий `cookies.txt`. Без браузера, без DevTools, без человека.
- `download_logos.cjs` читает токен, скачивает все нужные объекты через `GET /api/v1/buckets/.../objects/download?prefix=BASE64` в `prototype/public/assets/logos/`, пишет `logos-manifest.json`.

Канонические скрипты в этом репо: `scripts/refresh_cookies.cjs`, `scripts/download_logos.cjs` — оба zero-deps, stdlib Node.

**Типичное время:** ~5 секунд на 12 файлов. Если агент копошится дольше 30 секунд — он ушёл не туда, см. раздел «❌ НЕ ПЫТАЙСЯ».

---

## ❌ НЕ ПЫТАЙСЯ (антипаттерны, на которых сгорели)

Всё это выглядит разумно, но **не работает** в нашем окружении. Не трать время.

| Антипаттерн | Почему ломается |
|---|---|
| Читать cookie из `document.cookie` в браузере | Токен `HttpOnly` — JS его не видит by design. Используй POST `/api/v1/login` из Node. |
| `fetch('http://127.0.0.1:XXXX', …)` из HTTPS-таба в Chrome MCP | Private Network Access блокирует, даже с preflight-хедерами. Node не браузер — таких ограничений нет. |
| `<a download>` в цикле для нескольких файлов | Chrome блокирует multi-download после первого файла. Либо потеряешь время на разрешении, либо словишь `window.opener = null`. |
| `navigator.clipboard.writeText` / `document.execCommand('copy')` | Требуют фокус документа, который MCP-таб не имеет. Возврат: `Document is not focused` или `copied: false`. |
| `window.open` в рамках js-tool MCP | Popup-blocker всегда возвращает `null`. Нет user gesture → нет окна. |
| Cross-origin `fetch` из localhost-таба к MinIO API | Нет `Access-Control-Allow-Origin` на MinIO, CORS preflight валится. |
| Вытаскивать бинарь через `javascript_tool`-ответы (base64/hex-чанки) | Ответ режется на ~1500 символах, base64 эвристически блочится. На 45KB файл — 60+ круговых вызовов. |
| Ставить локальный HTTP-receiver и слать в него с HTTPS-таба | Упирается в PNA + Mixed-Content. Работает только если получатель — same-origin (что тоже гиморой). |
| Запускать S3-клиент (`aws s3`, `mc`, boto3, MinIO SDK) | S3-порт закрыт снаружи наглухо. Только Console REST API через HTTPS. |
| Бить в `s3.amazonaws.com`-совместимый endpoint (`/sf-ai/objects-logos/...`) | Ответит `HTTP 500 "Access Key Id does not exist"`. Это **не** протухший токен, это не тот URL. Console API живёт на `/api/v1/buckets/...`. |
| Парсить MinIO Console UI через DOM / `get_page_text` | Whitespace коллапсится, SVG приходят не byte-exact, типографика может ломаться. Node + REST даёт ровные байты. |

**Общий принцип:** Chrome sandbox — это не блокер, это тебе сигнал «ты на неправильном слое». Спускайся на Node. Токен обновляется Node'ом, файлы качаются Node'ом, браузер вообще в цепочке не нужен.

---

## TL;DR

1. **S3 (`aws s3`, `mc`, MinIO SDK, boto3) не работает** — S3-порт закрыт снаружи.
2. Единственный способ — **Console REST API** через HTTPS с cookie-авторизацией.
3. **Путь к объекту передаётся в `prefix` параметре в base64** (не URL-encoded).
4. **Токен** живёт в `cookies.txt` (Netscape-format). Обновляется либо автоматически скриптом `refresh_cookies.cjs` через POST `/api/v1/login` с кредами из `.env.local` (секция **3a**), либо руками через логин в браузере (секция 3).
5. **Бакет** — `sf-ai`. Лого в `objects-logos/`, фото часов в `objects-watches/`.
6. Имена файлов — `ct_brand_{snake_case}.{svg|png}` и `ct_product_line_{snake_case}.png`.

---

## 1. Конфигурация (где лежат креды)

| Что | Где | Формат |
|---|---|---|
| Base URL | `.env.local` → `MINIO_BASE` | `https://sa.minio-admin.semanticforce.ai` |
| Bucket | `.env.local` → `MINIO_BUCKET` | `sf-ai` |
| Логин/пароль (для ручного веб-входа) | `.env.local` → `MINIO_USER`, `MINIO_PASS` | строки |
| Сессионный токен | `cookies.txt` (корень проекта) | Netscape cookie format |
| Веб-консоль | https://sa.minio-admin.semanticforce.ai/ | открыть в браузере |

**ВАЖНО:** `cookies.txt` и `.env.local` — в `.gitignore`. Никогда не коммитить, не постить в логи, не отдавать в prompt внешним LLM без необходимости.

---

## 2. Формат `cookies.txt`

Одна строка, табами разделено, Netscape-формат:

```
sa.minio-admin.semanticforce.ai	FALSE	/	TRUE	0	token	<TOKEN_VALUE>
```

Поле `token` — имя куки, последнее поле — само значение (длинная base64-подобная строка).

**Извлечь токен из файла (bash/Node):**
```bash
TOKEN=$(awk -F'\t' 'END{print $NF}' cookies.txt)
```
```js
const token = fs.readFileSync('cookies.txt', 'utf8').split('\t').pop().trim();
```

---

## 3. Как обновить токен, когда он протух

Симптом протухшего токена: HTTP `401` или `403` на любой запрос к API.

**Шаги:**

1. Открыть в обычном браузере (НЕ в инкогнито) https://sa.minio-admin.semanticforce.ai/
2. Залогиниться: `MINIO_USER` / `MINIO_PASS` из `.env.local`.
3. DevTools → Application → Cookies → скопировать значение куки `token`.
4. Либо экспортировать все cookies для домена расширением типа **«cookies.txt (Netscape format)»** / «Get cookies.txt LOCALLY».
5. Заменить содержимое `cookies.txt` в корне проекта.
6. Проверить свежим запросом (см. ниже «Проверка»).

Токен действует несколько часов — если массово качаешь, делай это одной сессией.

---

## 3a. АВТООБНОВЛЕНИЕ токена без браузера (для агентов)

Если в `.env.local` есть `MINIO_USER` и `MINIO_PASS` — агент может обновить `cookies.txt` сам, без участия человека. MinIO Console принимает логин по JSON через тот же REST API и возвращает `token` в `Set-Cookie` заголовке (HttpOnly). Куки не нужно читать из браузера — её видно прямо в HTTP-ответе.

**Endpoint:**
```
POST {MINIO_BASE}/api/v1/login
Content-Type: application/json
Body: {"accessKey": "<MINIO_USER>", "secretKey": "<MINIO_PASS>"}
```
В ответе придёт `Set-Cookie: token=<VALUE>; Path=/; HttpOnly; Secure`. Берём значение `token`, пишем в `cookies.txt` в Netscape-формате.

**Готовый скрипт `refresh_cookies.cjs` (zero-deps):**

```js
const fs = require('fs');
const https = require('https');

const ENV = Object.fromEntries(
    fs.readFileSync('.env.local', 'utf8')
        .split('\n')
        .filter(l => l && !l.startsWith('#') && l.includes('='))
        .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

const BASE = (ENV.MINIO_BASE || 'https://sa.minio-admin.semanticforce.ai').replace(/\/$/, '');
const { MINIO_USER, MINIO_PASS } = ENV;

if (!MINIO_USER || !MINIO_PASS) {
    console.error('Missing MINIO_USER / MINIO_PASS in .env.local');
    process.exit(1);
}

const body = JSON.stringify({ accessKey: MINIO_USER, secretKey: MINIO_PASS });
const u = new URL(BASE + '/api/v1/login');

const req = https.request({
    method: 'POST',
    hostname: u.hostname,
    path: u.pathname,
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
    },
}, (res) => {
    const chunks = [];
    res.on('data', c => chunks.push(c));
    res.on('end', () => {
        if (res.statusCode !== 204 && res.statusCode !== 200) {
            console.error('Login failed:', res.statusCode, Buffer.concat(chunks).toString());
            process.exit(1);
        }
        const setCookie = res.headers['set-cookie'] || [];
        const tokenLine = setCookie.find(c => c.startsWith('token='));
        if (!tokenLine) {
            console.error('No token cookie in response. Headers:', res.headers);
            process.exit(1);
        }
        const token = tokenLine.split(';')[0].slice('token='.length);
        const netscape = `${u.hostname}\tFALSE\t/\tTRUE\t0\ttoken\t${token}\n`;
        fs.writeFileSync('cookies.txt', netscape);
        console.log('OK: cookies.txt refreshed, token length =', token.length);
    });
});

req.on('error', e => { console.error('Request error:', e.message); process.exit(1); });
req.write(body);
req.end();
```

**Использование:**
```bash
cd /path/to/project-root
node refresh_cookies.cjs
# → OK: cookies.txt refreshed, token length = 620
node download_missing.cjs   # теперь с живым токеном
```

**Pipeline для агента:** в `download_missing.cjs` добавь в начало проверку — если запрос вернул 401/403, запустить `refresh_cookies.cjs` и повторить один раз. Получается полностью автономный цикл.

**Когда автообновление НЕ работает:**
- В `.env.local` нет `MINIO_USER`/`MINIO_PASS` → нужен ручной экспорт cookie (секция 3).
- На MinIO включен SSO/OIDC/LDAP (редирект на внешний провайдер) → POST `/api/v1/login` вернёт 404 или 302 на SSO-страницу. Тогда только ручной экспорт.
- MFA на аккаунте → логин за один шаг не пройдёт.

В нашем bucket'е `sf-ai` — обычный accessKey/secretKey, автообновление работает.

---

## 4. API endpoint (скачивание одного объекта)

```
GET {MINIO_BASE}/api/v1/buckets/{BUCKET}/objects/download?prefix={BASE64_PATH}
Cookie: token={TOKEN}
```

- `{BASE64_PATH}` = `Buffer.from(path).toString('base64')` — **НЕ** URL-encoded, именно base64.
- `path` пишется как он есть в бакете: `objects-logos/ct_brand_longines.svg`.
- Response 200 → тело = бинарь файла. Response не-200 → объекта нет или нет доступа.

**Почему base64, а не обычный `?prefix=path`:** так устроен Console REST API MinIO — `prefix` ожидается закодированным в base64 (иначе слэши/точки ломают роутинг).

---

## 5. Структура бакета `sf-ai`

| Тип ассета | Путь в бакете | Пример |
|---|---|---|
| Лого бренда (SVG, приоритет) | `objects-logos/ct_brand_{snake_case}.svg` | `objects-logos/ct_brand_gerald_genta.svg` |
| Лого бренда (PNG, фоллбек) | `objects-logos/ct_brand_{snake_case}.png` | `objects-logos/ct_brand_gerald_genta.png` |
| Фото линейки/коллекции | `objects-watches/ct_product_line_{snake_case}.png` | `objects-watches/ct_product_line_junghans_sport.png` |

### Правила формирования `snake_case`

- Всё lowercase.
- Пробелы → `_`.
- Знаки препинания (`.`, `'`, `&`, `-`) → убрать или `_` (зависит от того, как загружено; пробуй оба варианта).
- Акценты/диакритика → ASCII-транслит: `Glashütte` → `glashutte`, `Jäger-LeCoultre` → `jaeger_lecoultre`.
- Составные: `Audemars Piguet` → `audemars_piguet`, `A. Lange & Söhne` → `a_lange_sohne` (варианты: `a_lange_und_sohne`).

**Если не угадал — нет 100% детерминированного правила**, в бакете историческая неконсистентность. Стратегия агента — пробовать варианты, см. алгоритм ниже.

### Порядок поиска (каскад)

1. `objects-logos/ct_brand_{snake}.svg` — 200 → готово.
2. `objects-logos/ct_brand_{snake}.png` — 200 → готово.
3. **Не найдено в обоих → текстовый fallback** в UI (никогда не оставлять пустой квадрат, рендерить имя бренда текстом).

Для фото коллекций: только `.png`, та же логика каскада (нашёл → берём, нет → текст/заглушка).

---

## 6. Рабочий скрипт (Node.js, zero-deps)

В этом проекте канонический скрипт лежит в **`scripts/download_logos.cjs`** — он читает `cookies.txt`, пробует SVG→PNG каскад для каждого бренда, пишет `prototype/src/assets/logos-manifest.json` с мапой «display name → файл». Можешь использовать его как есть или скопировать в новый проект и отредактировать список брендов.

Ниже — минимальный самодостаточный пример (только stdlib). Сохрани как `scripts/download_missing.cjs` или адаптируй под свой layout:

```js
const fs = require('fs');
const https = require('https');
const path = require('path');

const BASE = 'https://sa.minio-admin.semanticforce.ai';
const BUCKET = 'sf-ai';

const b64 = (str) => Buffer.from(str).toString('base64');
const token = fs.readFileSync('cookies.txt', 'utf8').split('\t').pop().trim();

function tryDownload(remotePath, localDest) {
    return new Promise((resolve) => {
        const url = `${BASE}/api/v1/buckets/${BUCKET}/objects/download?prefix=` + b64(remotePath);
        https.get(url, { headers: { 'Cookie': 'token=' + token } }, (res) => {
            if (res.statusCode === 200) {
                fs.mkdirSync(path.dirname(localDest), { recursive: true });
                const file = fs.createWriteStream(localDest);
                res.pipe(file);
                file.on('finish', () => { file.close(); console.log('OK   ', remotePath); resolve(true); });
            } else {
                res.resume();
                console.log('MISS ', res.statusCode, remotePath);
                resolve(false);
            }
        }).on('error', (e) => { console.log('ERR  ', e.message, remotePath); resolve(false); });
    });
}

async function findLogo(slug, destDir) {
    const svg = `objects-logos/ct_brand_${slug}.svg`;
    const png = `objects-logos/ct_brand_${slug}.png`;
    if (await tryDownload(svg, path.join(destDir, `${slug}.svg`))) return 'svg';
    if (await tryDownload(png, path.join(destDir, `${slug}.png`))) return 'png';
    return null; // → текстовый fallback в UI
}

async function findWatchPhoto(slug, destDir) {
    const png = `objects-watches/ct_product_line_${slug}.png`;
    return (await tryDownload(png, path.join(destDir, `col_${slug}.png`))) ? 'png' : null;
}

// ── пример использования ──
(async () => {
    const logoDir = 'public/assets/logos';
    const watchDir = 'public/assets/watches';

    const brandSlugs = ['longines', 'junghans', 'cartier', 'gerald_genta'];
    const collectionSlugs = ['junghans_sport', 'longines_dolcevita'];

    for (const slug of brandSlugs)      await findLogo(slug, logoDir);
    for (const slug of collectionSlugs) await findWatchPhoto(slug, watchDir);

    console.log('Done.');
})();
```

**Запуск:**
```bash
cd /path/to/project-root
node download_missing.cjs
```

Скрипт идемпотентен: запускай повторно, уже скачанные файлы он перезапишет, но это безопасно.

---

## 7. Ad-hoc проверка одного файла через curl

```bash
TOKEN=$(awk -F'\t' 'END{print $NF}' cookies.txt)
PATH64=$(printf 'objects-logos/ct_brand_longines.svg' | base64)

curl -s -o longines.svg -w 'HTTP %{http_code}\n' \
  -H "Cookie: token=$TOKEN" \
  "https://sa.minio-admin.semanticforce.ai/api/v1/buckets/sf-ai/objects/download?prefix=$PATH64"
```

- `HTTP 200` + файл на диске → всё ок.
- `HTTP 401/403` → токен протух, обновить `cookies.txt`.
- `HTTP 404` или пустой/JSON-ответ → объект не найден, попробовать другой slug.

**⚠️ macOS gotcha:** `base64` на macOS по умолчанию переносит строки каждые 76 символов — для коротких путей это не критично, но для безопасности используй `-i` или `python3 -c 'import base64,sys;print(base64.b64encode(sys.argv[1].encode()).decode())' <path>`.

---

## 8. Алгоритм для агента: «скачай лого для списка брендов»

Вход: массив brand names (`["Longines", "A. Lange & Söhne", "Jaeger-LeCoultre"]`).

1. **Slug-функция:**
   ```js
   const slug = name => name
       .toLowerCase()
       .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // убрать диакритику
       .replace(/[.'&]/g, '')                              // убрать ' . &
       .replace(/[\s\-]+/g, '_')                           // пробелы/дефисы → _
       .replace(/_+/g, '_')
       .replace(/^_|_$/g, '');
   ```
2. Для каждого бренда — попробовать `findLogo(slug, ...)` (SVG → PNG каскад).
3. Если нашёл — сохранить локально, вернуть путь.
4. Если НЕ нашёл — попробовать альтернативные варианты slug'а:
   - Заменить `&` на `and` (или на `und` для немецких).
   - Убрать инициалы с точкой: `A. Lange` → `lange`.
   - Разделители: попробовать `__` вместо `_`, или дефис вместо `_`.
5. Всё равно нет → записать в `missing.json` → UI рендерит **текстовый fallback** (имя бренда в белом/тёмном квадрате), НЕ пустой прямоугольник.

---

## 9. Траблшутинг

| Симптом | Причина | Фикс |
|---|---|---|
| `HTTP 401` / `403` на все запросы | Протух token | `node scripts/refresh_cookies.cjs` (секция 3a) ИЛИ ручной экспорт из браузера (секция 3) |
| `HTTP 500 "Access Key Id does not exist"` | Бьёшь в S3-совместимый endpoint вместо Console REST API | Проверить URL: должен быть `/api/v1/buckets/{bucket}/objects/download?prefix=BASE64`, **не** `/{bucket}/{path}`. Это ошибка endpoint'а, токен ни при чём. |
| `HTTP 404` на заведомо существующий объект | Путь не base64, или неправильный slug | Проверить кодирование; попробовать варианты slug |
| Скрипт качает HTML-страницу вместо бинаря | URL ведёт на веб-консоль, а не на API | Проверить `/api/v1/buckets/.../objects/download` в URL |
| Скачался пустой файл (0 байт) | `res.resume()` вместо `res.pipe()`, или 200 с пустым телом | Проверить логику скрипта, `Content-Length` в ответе |
| `aws s3 ls s3://sf-ai/...` — timeout | S3-порт закрыт | Нельзя, использовать только Console API |
| Работает из браузера, не работает из скрипта | Скрипт не шлёт Cookie, или шлёт не тот | Проверить `headers: { Cookie: 'token=...' }` |

---

## 10. Security notes для агента

- **Не логировать значение токена целиком.** При дебаге печатать первые 8 символов + длину: `token.slice(0,8) + '...(' + token.length + ')'`.
- **Не коммитить `cookies.txt` и `.env.local`** — они в `.gitignore`, оставить как есть.
- **Не пересылать токен в prompt сторонних LLM** (Anthropic/OpenAI/etc.) без явной необходимости. Если нужно — заменить на плейсхолдер `<TOKEN>` и подставлять локально.
- **Не делать массовую выгрузку всего бакета** — только точечные запросы по известным slug'ам. Это production-хранилище чужого проекта.

---

## 11. Чеклист перед запуском агента в новом проекте

**Быстрая дорожка (если в проекте есть `.env.local` с `MINIO_USER`/`MINIO_PASS`):**

- [ ] В корне лежит `.env.local` с `MINIO_BASE`, `MINIO_BUCKET`, `MINIO_USER`, `MINIO_PASS`
- [ ] В `scripts/` лежат `refresh_cookies.cjs` и `download_logos.cjs` (адаптированный под твой список ассетов)
- [ ] `.env.local` и `cookies.txt` в `.gitignore`
- [ ] Установлен Node.js ≥ 18
- [ ] Есть папки `public/assets/logos/` и `public/assets/watches/` (или аналог под твой фреймворк)
- [ ] Запущено: `node scripts/refresh_cookies.cjs && node scripts/download_logos.cjs`
- [ ] В UI — политика fallback: нет файла → текст (монограмма), не пустой квадрат

**Резервная дорожка (если нет кредов и нужен ручной экспорт):**

- [ ] Скопирован `cookies.txt` руками через DevTools (секция 3)
- [ ] `cookies.txt` в `.gitignore`
- [ ] Сделан ad-hoc curl-тест с одним заведомо существующим лого → `HTTP 200`
- [ ] Запущен download-скрипт

---

## 12. Ссылки

| Ресурс | URL |
|---|---|
| MinIO Console (UI) | https://sa.minio-admin.semanticforce.ai/ |
| API base | https://sa.minio-admin.semanticforce.ai/api/v1/ |
| Канонический refresh-скрипт (этот репо) | `scripts/refresh_cookies.cjs` |
| Канонический download-скрипт (этот репо) | `scripts/download_logos.cjs` |
| Manifest с живой картой лого | `prototype/src/assets/logos-manifest.json` |
| Локальная папка SVG/PNG | `prototype/public/assets/logos/` |
