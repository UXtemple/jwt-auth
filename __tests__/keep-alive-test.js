import { spy, stub } from 'sinon';
import proxyquire from 'proxyquire';
import test from 'tape';

const ENDPOINT_EXPIRED = 'endpoint-expired';
const ENDPOINT_VALID = 'endpoint-valid';
const EXPIRES_IN = 10000;
const EXPIRES_IN_TOO_EARLY = 1;
const KEEP_ALIVE_AT = 3000;
const KEEP_ALIVE_AT_DEFAULT = 5000;
const TOKEN = 'token';

const fetchToken = spy();
const getToken = stub();
getToken.withArgs(ENDPOINT_EXPIRED).returns(false);
getToken.withArgs(ENDPOINT_VALID).returns(true);

const keepAlive = proxyquire('../keep-alive', {
  './fetch-token': {
    default: fetchToken
  },
  './get-token': {
    default: getToken
  }
}).default;

const timeout = stub();
timeout.returns(1);

test('#keepAlive', t => {
  const _setTimeout = global.setTimeout;
  global.setTimeout = timeout;

  t.equals(typeof keepAlive(ENDPOINT_VALID, TOKEN, EXPIRES_IN, KEEP_ALIVE_AT), 'number', 'returns a timeout identifier');
  t.equals(timeout.args[0][1], EXPIRES_IN - KEEP_ALIVE_AT, 'keepAlive callback is set to fire on "expiresIn - keepAliveAt"');
  // call setTimeout callback that calls fetchToken internally
  timeout.args[0][0]();
  t.deepEquals(fetchToken.args[0], [ENDPOINT_VALID, `Bearer ${TOKEN}`, KEEP_ALIVE_AT], 'calls fetchToken');

  keepAlive(ENDPOINT_EXPIRED, TOKEN, EXPIRES_IN);
  // call setTimeout callback that calls fetchToken internally
  timeout.args[1][0]();
  t.ok(fetchToken.calledOnce, `when the endpoint's token expired don't renew it anymore`);

  t.throws(() => keepAlive(ENDPOINT_VALID, TOKEN, EXPIRES_IN_TOO_EARLY), `Can't renew token for ${ENDPOINT_VALID} as it is expired`, 'throws if token already expired');

  keepAlive(ENDPOINT_VALID, TOKEN, EXPIRES_IN);
  t.equals(timeout.args[1][1], KEEP_ALIVE_AT_DEFAULT, 'keepAliveAt defaults to 5000 ms before the token expires');

  global.setTimeout = _setTimeout;
  t.end();
});
