import createRenew from './create-renew';
import expiresIn from './expires-in';
import tokenFor from './token-for';

export default function keepAlive(endpoint, onNewToken, keepAliveAt = 5000) {
  // we'll try to renew the token keepAliveAt seconds before it expires
  const fetchEvery = expiresIn(tokenFor(endpoint)) - keepAliveAt;

  // if there's not enough time to do that we'll throw an error
  if (fetchEvery <= 0) {
    throw Error(`Can't renew token for ${endpoint} because its expiration time is too short to be able to renew it`);
  }

  // essentially run this forever until the user stops it
  const interval = setInterval(createRenew(endpoint, onNewToken), fetchEvery);

  // return a cleanup function so that you can cancel the keepAlive interval when you want to
  return () => clearInterval(interval);
}
