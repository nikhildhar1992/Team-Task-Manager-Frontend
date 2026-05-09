export function getLoginValidationMessage(email, password) {
  if (!email || !password) {
    return 'Email and password are required.';
  }

  return null;
}

export function getSignupValidationMessage(name, email, password, teamName) {
  if (!name || !email || !password || !teamName) {
    return 'Name, email, password, and team name are required.';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  if (teamName.length < 2) {
    return 'Team name must be at least 2 characters.';
  }

  return null;
}
