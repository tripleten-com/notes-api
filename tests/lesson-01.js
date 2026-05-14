// Lesson 01: Creating the User Model
// Run with: tsx tests/lesson-01.js

import User from '../src/models/user.js';

const title = 'Lesson 01: Creating the User Model';
console.log(`\n${title}\n`);

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
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

test('User model — email field exists', () => {
  const path = User.schema.path('email');
  assert(path, 'email field not found in schema');
});

test('User model — email is required', () => {
  const path = User.schema.path('email');
  assert(path, 'email field not found in schema');
  assert(path.isRequired, 'email field is not marked as required');
});

test('User model — email is unique', () => {
  const path = User.schema.path('email');
  assert(path, 'email field not found in schema');
  assert(path.options.unique === true, 'email field is not marked as unique');
});

test('User model — password field is required', () => {
  const path = User.schema.path('password');
  assert(path, 'password field not found in schema');
  assert(path.isRequired, 'password field is not marked as required');
});

test('User model — name field is required', () => {
  const path = User.schema.path('name');
  assert(path, 'name field not found in schema');
  assert(path.isRequired, 'name field is not marked as required');
});

console.log(`\n${passed} passed, ${failed} failed`);

if (failed === 0) {
  const code = Buffer.from('dW0zLXh0cWs=', 'base64').toString();
  console.log(`\nVerification code: ${code}`);
}

process.exit(failed > 0 ? 1 : 0);
