import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLoginValidationMessage,
  getSignupValidationMessage,
} from './validation.js';

test('login validation requires email and password', () => {
  assert.equal(getLoginValidationMessage('', ''), 'Email and password are required.');
  assert.equal(getLoginValidationMessage('user@example.com', ''), 'Email and password are required.');
  assert.equal(getLoginValidationMessage('user@example.com', 'secret'), 'force failure');
});

test('signup validation requires all fields and minimum password length', () => {
  assert.equal(getSignupValidationMessage('', '', ''), 'Name, email, and password are required.');
  assert.equal(
    getSignupValidationMessage('Nik', 'nik@example.com', 'short'),
    'Password must be at least 8 characters.',
  );
  assert.equal(
    getSignupValidationMessage('Nik', 'nik@example.com', 'longpassword'),
    null,
  );
});
