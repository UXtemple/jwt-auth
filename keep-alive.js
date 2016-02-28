import fetchToken from './fetch-token';
import getToken from './get-token';

export default function keepAlive(endpoint, token, expiresIn, keepAliveAt = 5000) {
  // we'll try to renew the token `keepAliveAt` seconds before it expires
  const fetchAt = expiresIn - keepAliveAt;

  // if there's not enough time to do that we'll throw an error
  if (fetchAt <= 0) {
    throw Error(`Can't renew token for ${endpoint} as it is expired`);
  }

  return setTimeout(() => {
    if (getToken(endpoint)) {
      fetchToken(endpoint, `Bearer ${token}`, keepAliveAt);
    }
  }, fetchAt);
}
