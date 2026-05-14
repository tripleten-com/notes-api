// Lesson 07: The Profile Endpoint
// Requires the server to be running: npm run dev
// Run with: node tests/lesson-07.js

const BASE_URL = 'http://localhost:3000';
const testEmail = `profile_test_${Date.now()}@example.com`;
const testPassword = 'password123';

const title = 'Lesson 07: The Profile Endpoint';
console.log(`\n${title}\n`);

let passed = 0;
let failed = 0;
let token = null;

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

// Register and log in to get a token
const registerRes = await fetch(`${BASE_URL}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: testEmail, password: testPassword, name: 'Profile Tester' }),
});

if (registerRes.status === 201) {
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword }),
  });
  if (loginRes.status === 200) {
    const loginBody = await loginRes.json();
    token = loginBody.data?.token ?? null;
  }
}

if (!token) {
  console.log('⚠️  Could not obtain a token — make sure register and login are implemented first\n');
}

if (token) {
  await test('GET /auth/me — returns the logged-in user with a valid token', async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(res.status === 200, `expected 200, got ${res.status}`);
    const body = await res.json();
    assert(body.success === true, 'expected success: true');
    assert(body.data?.email === testEmail, 'expected data.email to match the logged-in user');
    assert(!body.data?.password, 'password should not be in the profile response');
  });
} else {
  skip('GET /auth/me — returns the logged-in user with a valid token');
}

console.log(`\n${passed} passed, ${failed} failed`);

if (failed === 0 && token) {
  const code = Buffer.from('Ymc5LWt3dHM=', 'base64').toString();
  console.log(`\nVerification code: ${code}`);
}

process.exit(failed > 0 ? 1 : 0);
