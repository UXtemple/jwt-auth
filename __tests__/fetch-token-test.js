import { spy, stub } from 'sinon';
import proxyquire from 'proxyquire';
import test from 'tape';

const AUTH = 'auth';
const ENDPOINT = 'endpoint';
const KEEP_ALIVE_AT = 'keepAliveAt';
const POST = {method: 'POST'};
const TOKEN = 'token';

const fetchAuth = stub();
fetchAuth.withArgs(ENDPOINT, AUTH, POST).returns(TOKEN);
const store = spy();

const fetchToken = proxyquire.noCallThru()('../fetch-token', {
  'fetch-auth': fetchAuth,
  './store': store
}).default;

test('#fetchToken', async t => {
  t.equals(await fetchToken(ENDPOINT, AUTH, KEEP_ALIVE_AT), TOKEN, 'gets token');
  t.deepEquals(store.args[0], [ENDPOINT, TOKEN, KEEP_ALIVE_AT], 'stores the token with the endpoint');
   t.end();
});
