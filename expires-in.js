import getExpires from './get-expires';

export default function expiresIn(token) {
  const expires = getExpires(token);
  return expires && expires - Date.now();
}
