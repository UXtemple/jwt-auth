import { spy, stub } from 'sinon';
import proxyquire from 'proxyquire';
import test from 'tape';

test('#fetchToken', async t => {
  const AUTH = 'auth';
  const ENDPOINT = 'endpoint';
  const POST = {method: 'POST'};
  const TOKEN = 'token';

  const fetchAuth = stub();
  fetchAuth.withArgs(ENDPOINT, AUTH, POST).returns(TOKEN);

  const setItem = spy();
  global.localStorage = {setItem};

  const fetchToken = proxyquire.noCallThru()('../fetch-token', {
    'fetch-auth': fetchAuth
  }).default;

  t.equals(await fetchToken(ENDPOINT, AUTH), TOKEN, 'gets token');
  t.deepEquals(setItem.args[0], [ENDPOINT, TOKEN], 'stores it in local storage');

  delete global.localStorage;
  t.end();
});
