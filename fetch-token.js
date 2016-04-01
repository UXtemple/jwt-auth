import fetchAuth from 'fetch-auth';

export default async function fetchToken(endpoint, auth) {
  // try to authenticate and get a token
  const token = await fetchAuth(endpoint, auth, {method: 'POST'});

  // store the token in local storage under the endpoint for later use
  localStorage.setItem(endpoint, token);

  return token;
}
