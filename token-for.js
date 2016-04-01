import expiresIn from './expires-in';
import logout from './logout';

export default function tokenFor(endpoint) {
  let token = localStorage.getItem(endpoint) || false;

  if (token && expiresIn(token) <= 0) {
    logout(endpoint);
    token = false;
  }

  return token;
}
