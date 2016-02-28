import getExpires from './get-expires';

export default function getExpiresIn(token) {
  const expires = getExpires(token);
  return expires && expires - Date.now();
}
