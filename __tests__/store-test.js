import { spy, stub } from 'sinon';
import logout from '../logout';
import proxyquire from 'proxyquire';
import test from 'tape';

const ENDPOINT = 'endpoint';
const EXPIRES = 'expires';
const KEEP_ALIVE_AT = 'keepAliveAt';
const TOKEN = 'token';
const TOKEN_EXPIRES = 'token-expires';

const localStorage = {
  setItem: spy()
};

const getExpiresIn = stub();
getExpiresIn.withArgs(TOKEN).returns(false);
getExpiresIn.withArgs(TOKEN_EXPIRES).returns(EXPIRES);

const keepAlive = spy();

const store = proxyquire('../store', {
  './get-expires-in': {
    default: getExpiresIn
  },
  './keep-alive': {
    default: keepAlive
  }
}).default;

test('#store', t => {
  global.localStorage = localStorage;

  store(ENDPOINT, TOKEN);
  t.deepEquals(localStorage.setItem.args[0], [ENDPOINT, TOKEN], 'saves the token to the endpoint in localStorage');
  t.notOk(keepAlive.called, `doesn't call keepAlive because this token doesn't expire`);

  store(ENDPOINT, TOKEN_EXPIRES, KEEP_ALIVE_AT);
  t.deepEquals(localStorage.setItem.args[1], [ENDPOINT, TOKEN_EXPIRES], 'saves the token that expires to the endpoint in localStorage');
  t.deepEquals(keepAlive.args[0], [ENDPOINT, TOKEN_EXPIRES, EXPIRES, KEEP_ALIVE_AT], 'keeps the token alive');

  delete global.localStorage;
  t.end();
});
