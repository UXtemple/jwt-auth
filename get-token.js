import getExpiresIn from './get-expires-in';
import logout from './logout';

export default function getToken(endpoint) {
  let token = localStorage.getItem(endpoint) || false;

  if (token) {
    const expiresIn = getExpiresIn(token);

    if (expiresIn <= 0) {
      logout(endpoint);
      token = false;
    }
  }

  return token;
}
