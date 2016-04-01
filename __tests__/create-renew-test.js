import { spy, stub } from 'sinon';
import proxyquire from 'proxyquire';
import test from 'tape';

const ENDPOINT = 'ENDPOINT';
const ENDPOINT_WITHOUT_TOKEN = 'ENDPOINT_WITHOUT_TOKEN';
const NEW_TOKEN = 'NEW_TOKEN';
const TOKEN = 'TOKEN';

test('#createRenew succeeds with callback', async t => {
  const callback = spy();
  const fetchToken = stub();
  fetchToken.returns(NEW_TOKEN);
  const tokenFor = stub();
  tokenFor.returns(TOKEN);

  const createRenew = proxyquire.noCallThru()('../create-renew', {
    './fetch-token': fetchToken,
    './token-for': tokenFor
  }).default;

  const renew = createRenew(ENDPOINT, callback);
  t.equals(typeof renew, 'function', 'returns a renew function');

  await renew();
  t.deepEquals(fetchToken.args[0], [ENDPOINT, `Bearer ${TOKEN}`], 'gets the new token authenticating with the old');
  t.deepEquals(callback.args[0], [NEW_TOKEN, undefined], 'calls the callback with the new token');

  t.end();
});

test('#renew no callback', async t => {
  const fetchToken = stub();
  fetchToken.returns(NEW_TOKEN);
  const tokenFor = stub();
  tokenFor.returns(TOKEN);

  const createRenew = proxyquire.noCallThru()('../create-renew', {
    './fetch-token': fetchToken,
    './token-for': tokenFor
  }).default;

  const renew = createRenew(ENDPOINT);

  let threw = false;
  try {
    await renew();
  } catch(err) {
    threw = true;
  }
  t.notOk(threw, `doesn't fail if there's no callback`);

  t.end();
});

test('#renew no token with callback', async t => {
  const callback = spy();
  const fetchToken = stub();
  const FETCH_TOKEN_ERROR = new Error('fetch token');
  fetchToken.throws(FETCH_TOKEN_ERROR);
  const tokenFor = stub();
  tokenFor.withArgs(ENDPOINT_WITHOUT_TOKEN).returns(undefined);
  tokenFor.withArgs(ENDPOINT).returns(TOKEN);

  const createRenew = proxyquire.noCallThru()('../create-renew', {
    './fetch-token': fetchToken,
    './token-for': tokenFor
  }).default;

  await createRenew(ENDPOINT_WITHOUT_TOKEN, callback)();
  t.equals(typeof callback.args[0][0], 'undefined', 'no new token');
  t.equals(callback.args[0][1].message, `Can't find token for ${ENDPOINT_WITHOUT_TOKEN}`, `tells it couldn't find a token for the endpoint`);

  await createRenew(ENDPOINT, callback)();
  t.equals(typeof callback.args[1][0], 'undefined', 'no new token');
  t.equals(callback.args[1][1].message, `Failed to renew token for ${ENDPOINT}`, `tells it couldn't renew the token for the endpoint`);
  t.equals(callback.args[1][1].original, FETCH_TOKEN_ERROR, `error.original exposes the error from fetchToken`);

  t.end();
});
