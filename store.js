import getExpiresIn from './get-expires-in';
import keepAlive from './keep-alive';

export default function store(endpoint, token, keepAliveAt) {
  // store the token in local storage under the endpoint for later use
  localStorage.setItem(endpoint, token);

  // if the token expires keep it alive
  const expiresIn = getExpiresIn(token);
  if (expiresIn) {
    keepAlive(endpoint, token, expiresIn, keepAliveAt);
  }
}
