import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getLoginValidationMessage,
  getSignupValidationMessage,
} from './validation.js';

test('login validation requires email and password', () => {
  assert.equal(getLoginValidationMessage('', ''), 'Email and password are required.');
  assert.equal(getLoginValidationMessage('user@example.com', ''), 'Email and password are required.');
  assert.equal(getLoginValidationMessage('user@example.com', 'secret'), null);
});

test('signup validation requires all fields and minimum password length', () => {
  assert.equal(
    getSignupValidationMessage('', '', '', ''),
    'Name, email, password, and team name are required.',
  );
  assert.equal(
    getSignupValidationMessage('Nik', 'nik@example.com', 'short', 'Team Alpha'),
    'Password must be at least 8 characters.',
  );
  assert.equal(
    getSignupValidationMessage('Nik', 'nik@example.com', 'longpassword', 'T'),
    'Team name must be at least 2 characters.',
  );
  assert.equal(
    getSignupValidationMessage('Nik', 'nik@example.com', 'longpassword', 'Team Alpha'),
    null,
  );
});
