export default function getExpires(token) {
  return JSON.parse(atob(token.split('.')[1])).exp * 1000 || false;
}
