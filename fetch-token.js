import fetchAuth from 'fetch-auth';
import store from './store';

export default async function fetchToken(endpoint, auth, keepAliveAt) {
  // try to authenticate and get a token
  const token = await fetchAuth(endpoint, auth, {method: 'POST'});

  // store the token for in local storage
  store(endpoint, token, keepAliveAt);

  return token;
}
