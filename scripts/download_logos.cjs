/**
 * MinIO logo downloader — для тайла «Top brands at the fair» + плитки коллекций.
 * Читает токен из cookies.txt (Netscape-формат) в корне проекта.
 * Каскад: SVG → PNG → ничего (UI рендерит текстовый fallback).
 *
 * Полная инструкция — в MINIO_WORKFLOW.md в корне репо.
 * Запуск: node scripts/download_logos.cjs
 */
const fs = require('fs')
const https = require('https')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const BASE = 'https://sa.minio-admin.semanticforce.ai'
const BUCKET = 'sf-ai'
const COOKIES = path.join(ROOT, 'cookies.txt')
const LOGO_DIR = path.join(ROOT, 'prototype/public/assets/logos')
const MANIFEST_PATH = path.join(ROOT, 'prototype/src/assets/logos-manifest.json')

if (!fs.existsSync(COOKIES)) {
  console.error(`✗ ${COOKIES} не найден. См. MINIO_WORKFLOW.md §3.`)
  process.exit(1)
}
const token = fs.readFileSync(COOKIES, 'utf8').trim().split('\t').pop().trim()
console.log(`token: ${token.slice(0, 8)}…(${token.length})`)

const b64 = (s) => Buffer.from(s).toString('base64')

function tryDownload(remotePath, localDest) {
  return new Promise((resolve) => {
    const url = `${BASE}/api/v1/buckets/${BUCKET}/objects/download?prefix=${b64(remotePath)}`
    https
      .get(url, { headers: { Cookie: 'token=' + token } }, (res) => {
        if (res.statusCode === 200) {
          fs.mkdirSync(path.dirname(localDest), { recursive: true })
          const file = fs.createWriteStream(localDest)
          res.pipe(file)
          file.on('finish', () => {
            file.close()
            const size = fs.statSync(localDest).size
            console.log(`  ✓ ${remotePath} → ${path.relative(ROOT, localDest)} (${size}b)`)
            resolve(true)
          })
        } else {
          // читаем тело, чтобы не держать сокет открытым + в случае 500 увидеть ошибку
          let body = ''
          res.on('data', (c) => (body += c))
          res.on('end', () => {
            const hint = res.statusCode >= 500 ? ` — ${body.slice(0, 120)}` : ''
            console.log(`  ✗ ${res.statusCode} ${remotePath}${hint}`)
            resolve(false)
          })
        }
      })
      .on('error', (e) => {
        console.log(`  ! ${e.message} ${remotePath}`)
        resolve(false)
      })
  })
}

/**
 * Пытается несколько вариантов slug'а (SVG → PNG на каждый).
 * Возвращает {slug, ext} первого успеха или null.
 */
async function findLogo(brandName, slugVariants) {
  console.log(`\n[${brandName}]`)
  for (const slug of slugVariants) {
    for (const ext of ['svg', 'png']) {
      const remote = `objects-logos/ct_brand_${slug}.${ext}`
      const local = path.join(LOGO_DIR, `${slugVariants[0]}.${ext}`) // сохраняем под каноническим slug'ом
      const ok = await tryDownload(remote, local)
      if (ok) return { slug: slugVariants[0], ext, matchedSlug: slug }
    }
  }
  return null
}

// ── Бренды из prototype/src/data.ts (brands + collections + topWatches uniques) ──
// [canonical slug, ...alternate slugs to try]
const BRANDS = [
  { name: 'Rolex',            slugs: ['rolex'] },
  { name: 'Tudor',            slugs: ['tudor'] },
  { name: 'Patek Philippe',   slugs: ['patek_philippe'] },
  { name: 'IWC',              slugs: ['iwc', 'iwc_schaffhausen'] },
  { name: 'Piaget',           slugs: ['piaget'] },
  { name: 'Bvlgari',          slugs: ['bvlgari', 'bulgari'] },
  { name: 'Chopard',          slugs: ['chopard'] },
  { name: 'Eberhard & Co.',   slugs: ['eberhard_co', 'eberhard', 'eberhard_and_co'] },
  { name: 'Hublot',           slugs: ['hublot'] },
  { name: 'Jaeger-LeCoultre', slugs: ['jaeger_lecoultre', 'jaeger-lecoultre', 'jaegerlecoultre'] },
  { name: 'Chanel',           slugs: ['chanel'] },
  { name: 'Cartier',          slugs: ['cartier'] },
]

;(async () => {
  fs.mkdirSync(LOGO_DIR, { recursive: true })
  const manifest = {}
  let found = 0

  for (const brand of BRANDS) {
    const res = await findLogo(brand.name, brand.slugs)
    if (res) {
      manifest[brand.name] = { file: `${res.slug}.${res.ext}`, matchedSlug: res.matchedSlug }
      found++
    } else {
      manifest[brand.name] = null
    }
  }

  // manifest пишем в src/, чтобы TS мог его заимпортить в BrandMonogram.
  // Сами бинарники — в public/assets/logos/, отдаются Vite'ом статикой по /assets/logos/.
  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true })
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`\n── итог ──`)
  console.log(`нашли: ${found}/${BRANDS.length}`)
  console.log(`manifest: ${path.relative(ROOT, MANIFEST_PATH)}`)
  const missing = Object.entries(manifest).filter(([, v]) => !v).map(([k]) => k)
  if (missing.length) console.log(`нет файла (fallback на текст): ${missing.join(', ')}`)
})()
