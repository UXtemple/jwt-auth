import fetchToken from './fetch-token';
import tokenFor from './token-for';

export default function createRenew(endpoint, callback) {
  return async () => {
    const token = tokenFor(endpoint);
    let error;
    let newToken;

    if (token) {
      try {
        newToken = await fetchToken(endpoint, `Bearer ${token}`);
      } catch(err) {
        error = new Error(`Failed to renew token for ${endpoint}`);
        error.original = err;
      }
    } else {
      error = new Error(`Can't find token for ${endpoint}`);
    }

    // if we were given a callback to notify someone of new tokens, do it
    if (typeof callback === 'function') {
      callback(newToken, error);
    } else if (error) {
      console.error(error);
    }
  };
}
