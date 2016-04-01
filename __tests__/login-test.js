import { stub } from 'sinon';
import proxyquire from 'proxyquire';
import test from 'tape';

const BASE64 = 'dXNlcjpwYXNzd29yZA==';
const ENDPOINT = 'endpoint';
const PASSWORD = 'password';
const TOKEN = 'token';
const USER = 'user';

const btoa = stub();
btoa.withArgs(`${USER}:${PASSWORD}`).returns(BASE64);
const fetchToken = stub();
fetchToken.withArgs(ENDPOINT, `Basic ${BASE64}`).returns(TOKEN);

const login = proxyquire('../login', {
  './fetch-token': {
    default: fetchToken
  }
}).default;

test('#login', async t => {
  global.btoa = btoa;

  t.equals(await login(ENDPOINT, USER, PASSWORD), TOKEN, 'gets token');

  delete global.btoa;
  t.end();
});
