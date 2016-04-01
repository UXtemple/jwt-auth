import proxyquire from 'proxyquire';
import test from 'tape';

test('jwtAuth main exports', async t => {
  const expiresIn = 'expiresIn';
  const keepAlive = 'keepAlive';
  const login = 'login';
  const logout = 'logout';
  const tokenFor = 'tokenFor';

  const jwtAuth = proxyquire.noCallThru()('../index', {
    './expires-in': expiresIn,
    './keep-alive': keepAlive,
    './login': login,
    './logout': logout,
    './token-for': tokenFor
  });

  t.equals(jwtAuth.expiresIn, expiresIn, 'exports expiresIn');
  t.equals(jwtAuth.keepAlive, keepAlive, 'exports keepAlive0');
  t.equals(jwtAuth.login, login, 'exports login');
  t.equals(jwtAuth.logout, logout, 'exports logout');
  t.equals(jwtAuth.tokenFor, tokenFor, 'exports tokenFor');

  t.end();
});
