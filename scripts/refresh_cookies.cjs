/**
 * MinIO Console auto-refresh токена — без браузера.
 * Читает MINIO_USER/MINIO_PASS из .env.local в корне проекта, бьёт POST /api/v1/login,
 * вытаскивает token из Set-Cookie и пишет свежий cookies.txt в Netscape-формате.
 *
 * Полное описание — MINIO_WORKFLOW.md §3a.
 * Запуск: node scripts/refresh_cookies.cjs
 */
const fs = require('fs')
const path = require('path')
const https = require('https')

const ROOT = path.resolve(__dirname, '..')
const ENV_PATH = path.join(ROOT, '.env.local')
const COOKIES_PATH = path.join(ROOT, 'cookies.txt')

if (!fs.existsSync(ENV_PATH)) {
  console.error(`✗ ${ENV_PATH} не найден. См. MINIO_WORKFLOW.md §3a.`)
  process.exit(1)
}

const ENV = Object.fromEntries(
  fs
    .readFileSync(ENV_PATH, 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')]
    }),
)

const BASE = (ENV.MINIO_BASE || 'https://sa.minio-admin.semanticforce.ai').replace(/\/$/, '')
const { MINIO_USER, MINIO_PASS } = ENV

if (!MINIO_USER || !MINIO_PASS) {
  console.error('✗ Missing MINIO_USER / MINIO_PASS in .env.local')
  process.exit(1)
}

const body = JSON.stringify({ accessKey: MINIO_USER, secretKey: MINIO_PASS })
const u = new URL(BASE + '/api/v1/login')

const req = https.request(
  {
    method: 'POST',
    hostname: u.hostname,
    path: u.pathname,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  },
  (res) => {
    const chunks = []
    res.on('data', (c) => chunks.push(c))
    res.on('end', () => {
      if (res.statusCode !== 204 && res.statusCode !== 200) {
        console.error(`✗ Login failed: ${res.statusCode} ${Buffer.concat(chunks).toString().slice(0, 200)}`)
        process.exit(1)
      }
      const setCookie = res.headers['set-cookie'] || []
      const tokenLine = setCookie.find((c) => c.startsWith('token='))
      if (!tokenLine) {
        console.error('✗ No token cookie in Set-Cookie. Headers:', res.headers)
        process.exit(1)
      }
      const token = tokenLine.split(';')[0].slice('token='.length)
      const netscape = `${u.hostname}\tFALSE\t/\tTRUE\t0\ttoken\t${token}\n`
      fs.writeFileSync(COOKIES_PATH, netscape)
      console.log(`✓ cookies.txt refreshed, token length = ${token.length}`)
    })
  },
)

req.on('error', (e) => {
  console.error('✗ Request error:', e.message)
  process.exit(1)
})

req.write(body)
req.end()
