// Lesson 06: Auth Middleware
// Requires the server to be running: npm run dev
// Run with: node tests/lesson-06.js

const BASE_URL = 'http://localhost:3000';

const title = 'Lesson 06: Auth Middleware';
console.log(`\n${title}\n`);

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`❌ ${name} — ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await test('GET /auth/me — returns 401 with no token', async () => {
  const res = await fetch(`${BASE_URL}/auth/me`);
  assert(res.status === 401, `expected 401, got ${res.status}`);
  const body = await res.json();
  assert(body.success === false, 'expected success: false');
  assert(body.error?.message, 'expected error.message to be present');
});

await test('GET /auth/me — returns 401 with a malformed token', async () => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: 'Bearer this-is-not-a-valid-token' },
  });
  assert(res.status === 401, `expected 401, got ${res.status}`);
  const body = await res.json();
  assert(body.success === false, 'expected success: false');
});

await test('GET /auth/me — returns 401 with missing Bearer prefix', async () => {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: 'notabearer token' },
  });
  assert(res.status === 401, `expected 401, got ${res.status}`);
});

await test('DELETE /notes/:id — returns 401 with no token', async () => {
  const res = await fetch(`${BASE_URL}/notes/000000000000000000000001`, {
    method: 'DELETE',
  });
  assert(res.status === 401, `expected 401, got ${res.status}`);
  const body = await res.json();
  assert(body.success === false, 'expected success: false');
});

console.log(`\n${passed} passed, ${failed} failed`);

if (failed === 0) {
  const code = Buffer.from('bmg0LWRmemU=', 'base64').toString();
  console.log(`\nVerification code: ${code}`);
}

process.exit(failed > 0 ? 1 : 0);
