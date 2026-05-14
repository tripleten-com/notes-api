// Lesson 04: Implementing the Register Route
// Requires the server to be running: npm run dev
// Run with: node tests/lesson-04.js

const BASE_URL = 'http://localhost:3000';
const testEmail = `test_${Date.now()}@example.com`;

const title = 'Lesson 04: Implementing the Register Route';
console.log(`\n${title}\n`);

let passed = 0;
let failed = 0;
let registeredUserId = null;

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

await test('POST /auth/register — returns 201 with valid body', async () => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'password123', name: 'Test User' }),
  });
  assert(res.status === 201, `expected 201, got ${res.status}`);
  const body = await res.json();
  assert(body.success === true, 'expected success: true');
  assert(body.data?.userId, 'expected data.userId to be present');
  assert(body.data?.email === testEmail, 'expected data.email to match');
  assert(body.data?.name === 'Test User', 'expected data.name to match');
  assert(!body.data?.password, 'password should not be in the response');
  registeredUserId = body.data.userId;
});

await test('POST /auth/register — returns 400 when fields are missing', async () => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail }),
  });
  assert(res.status === 400, `expected 400, got ${res.status}`);
  const body = await res.json();
  assert(body.success === false, 'expected success: false');
  assert(body.error?.message, 'expected error.message to be present');
});

await test('POST /auth/register — response never includes password', async () => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `safe_${Date.now()}@example.com`,
      password: 'secret',
      name: 'Safe Check',
    }),
  });
  const body = await res.json();
  const bodyStr = JSON.stringify(body);
  assert(!bodyStr.includes('secret'), 'password appeared in response body');
});

console.log(`\n${passed} passed, ${failed} failed`);

if (failed === 0) {
  const code = Buffer.from('cngyLXZid2o=', 'base64').toString();
  console.log(`\nVerification code: ${code}`);
}

process.exit(failed > 0 ? 1 : 0);
