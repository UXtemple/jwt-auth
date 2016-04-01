import { match, spy, stub } from 'sinon';
import proxyquire from 'proxyquire';
import test from 'tape';

const CALLBACK = spy();
const ENDPOINT_EXPIRED = 'endpoint-expired';
const ENDPOINT_VALID = 'endpoint-valid';
const EXPIRES_IN = 10000;
const EXPIRES_IN_TOO_EARLY = 1;
const KEEP_ALIVE_AT = 3000;
const KEEP_ALIVE_AT_DEFAULT = 5000;
const TOKEN_EXPIRED = 'token-expired';
const TOKEN_VALID = 'token-valid';

const createRenew = stub();
const RENEW = 'renew';
createRenew.withArgs(ENDPOINT_VALID, match.any).returns(RENEW);

const expiresIn = stub();
expiresIn.withArgs(TOKEN_EXPIRED).returns(EXPIRES_IN_TOO_EARLY);
expiresIn.withArgs(TOKEN_VALID).returns(EXPIRES_IN);

const tokenFor = stub();
tokenFor.withArgs(ENDPOINT_EXPIRED).returns(TOKEN_EXPIRED);
tokenFor.withArgs(ENDPOINT_VALID).returns(TOKEN_VALID);

const keepAlive = proxyquire.noCallThru()('../keep-alive', {
  './create-renew': createRenew,
  './expires-in': expiresIn,
  './token-for': tokenFor
}).default;

const interval = {
  clear: spy(),
  set: stub()
};
const INTERVAL_ID = 1;
interval.set.returns(INTERVAL_ID);

test('#keepAlive', t => {
  const _clearInterval = global.clearInterval;
  global.clearInterval = interval.clear;
  const _setInterval = global.setInterval;
  global.setInterval = interval.set;

  const clear = keepAlive(ENDPOINT_VALID);

  t.equals(typeof clear, 'function', 'returns a function');
  t.deepEquals(interval.set.args[0], [RENEW, EXPIRES_IN - KEEP_ALIVE_AT_DEFAULT], 'sets up renew interval');
  clear();
  t.equals(interval.clear.args[0][0], INTERVAL_ID, 'calling the returned function clears the interval');

  t.throws(
    () => keepAlive(ENDPOINT_EXPIRED),
    `Can't renew token for ${ENDPOINT_EXPIRED} because its expiration time is too short to be able to renew it`,
    `throws if there's no time to renew token`
  );

  keepAlive(ENDPOINT_VALID, CALLBACK);
  t.equals(createRenew.args[1][1], CALLBACK, 'if set, passes the onNewToken callback to renew');

  global.clearInterval = _clearInterval;
  global.setInterval = _setInterval;
  t.end();
});
