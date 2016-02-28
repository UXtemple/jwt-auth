import proxyquire from 'proxyquire';
import test from 'tape';

const login = 'login';
const logout = 'logout';
const getToken = 'getToken';
const getExpiresIn = 'getExpiresIn';

const jwtAuth = proxyquire.noCallThru()('../index', {
  './login': login,
  './logout': logout,
  './get-token': getToken,
  './get-expires-in': getExpiresIn
});

test('jwtAuth main exports', async t => {
  t.equals(jwtAuth.login, login, 'exports login');
  t.equals(jwtAuth.logout, logout, 'exports logout');
  t.equals(jwtAuth.getToken, getToken, 'exports getToken');
  t.equals(jwtAuth.getExpiresIn, getExpiresIn, 'exports getExpiresIn');

  t.end();
});
