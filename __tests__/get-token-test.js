import { spy, stub } from 'sinon';
import proxyquire from 'proxyquire';
import test from 'tape';

const ENDPOINT_DOESNT_EXIST = 'endpoint-doesnt-exist';
const ENDPOINT_EXPIRED = 'endpoint-expired';
const ENDPOINT_VALID = 'endpoint-valid';
const TOKEN_EXPIRED = 'token-expired';
const TOKEN_VALID = 'token-valid';

const getExpiresIn = stub();
getExpiresIn.withArgs(TOKEN_EXPIRED).returns(0);
getExpiresIn.withArgs(TOKEN_VALID).returns(1);

const localStorage = {
  getItem: stub()
};
localStorage.getItem.withArgs(ENDPOINT_DOESNT_EXIST).returns(undefined);
localStorage.getItem.withArgs(ENDPOINT_VALID).returns(TOKEN_VALID);
localStorage.getItem.withArgs(ENDPOINT_EXPIRED).returns(TOKEN_EXPIRED);

const logout = spy();

const getToken = proxyquire('../get-token', {
  './get-expires-in': {
    default: getExpiresIn
  },
  './logout': {
    default: logout
  }
}).default;

test('#store', t => {
  global.localStorage = localStorage;

  t.notOk(getToken(ENDPOINT_DOESNT_EXIST), `returns false if endpoint's token doesn't exist`);
  t.equals(getToken(ENDPOINT_VALID), TOKEN_VALID, `returns token if endpoint's token exists`);
  t.notOk(getToken(ENDPOINT_EXPIRED), `returns false if endpoint's token existed but expired`);
  t.equals(logout.args[0][0], ENDPOINT_EXPIRED, `calls logout when an expired endpoint token was found`);

  delete global.localStorage;
  t.end();
});
