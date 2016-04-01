import fetchToken from './fetch-token';

export default async function login(endpoint, user, password) {
  // encode user and password in a base64 string
  const basic = btoa(`${user}:${password}`);

  // try to get the token
  return await fetchToken(endpoint, `Basic ${basic}`);
}
