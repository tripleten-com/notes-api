// Lesson 05: Implementing the Login Route
// Requires the server to be running: npm run dev
// Run with: node tests/lesson-05.js

const BASE_URL = 'http://localhost:3000';
const testEmail = `login_test_${Date.now()}@example.com`;
const testPassword = 'password123';

const title = 'Lesson 05: Implementing the Login Route';
console.log(`\n${title}\n`);

let passed = 0;
let failed = 0;
let loginSkipped = false;

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

function skip(name) {
  console.log(`○ ${name} — skipped`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// Register a user to log in with
const registerRes = await fetch(`${BASE_URL}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: testEmail, password: testPassword, name: 'Login Tester' }),
});

if (registerRes.status !== 201) {
  console.log('⚠️  Could not register test user — make sure the register route is implemented first');
  loginSkipped = true;
}

if (!loginSkipped) {
  await test('POST /auth/login — returns 200 with valid credentials', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: testPassword }),
    });
    assert(res.status === 200, `expected 200, got ${res.status}`);
    const body = await res.json();
    assert(body.success === true, 'expected success: true');
    assert(body.data?.token, 'expected data.token to be present');
    assert(body.data?.user?.email === testEmail, 'expected data.user.email to match');
    assert(!body.data?.user?.password, 'password should not be in the response');
  });
} else {
  skip('POST /auth/login — returns 200 with valid credentials');
}

await test('POST /auth/login — returns 401 for wrong password', async () => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'wrongpassword' }),
  });
  assert(res.status === 401, `expected 401, got ${res.status}`);
  const body = await res.json();
  assert(body.success === false, 'expected success: false');
  assert(body.error?.message === 'Invalid credentials', 'expected generic "Invalid credentials" message');
});

await test('POST /auth/login — returns 401 for non-existent email', async () => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nobody@example.com', password: 'whatever' }),
  });
  assert(res.status === 401, `expected 401, got ${res.status}`);
  const body = await res.json();
  assert(body.error?.message === 'Invalid credentials', 'expected generic "Invalid credentials" message');
});

await test('POST /auth/login — returns 400 when fields are missing', async () => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail }),
  });
  assert(res.status === 400, `expected 400, got ${res.status}`);
});

console.log(`\n${passed} passed, ${failed} failed`);

if (failed === 0 && !loginSkipped) {
  const code = Buffer.from('bGs3LXlwY20=', 'base64').toString();
  console.log(`\nVerification code: ${code}`);
}

process.exit(failed > 0 ? 1 : 0);
