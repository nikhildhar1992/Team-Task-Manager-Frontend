export function getLoginValidationMessage(email, password) {
  if (!email || !password) {
    return 'Email and password are required.';
  }

  return null;
}

export function getSignupValidationMessage(name, email, password) {
  if (!name || !email || !password) {
    return 'Name, email, and password are required.';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  return null;
}
