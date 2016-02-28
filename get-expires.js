export default function getExpires(token) {
  return JSON.parse(atob(token.split('.')[1])).exp || false;
}
