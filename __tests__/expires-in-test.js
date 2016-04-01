import { stub } from 'sinon';
import proxyquire from 'proxyquire';
import test from 'tape';

const TOKEN_WITH_EXP = 'exp';
const TOKEN_WITHOUT_EXP = 'no-exp';

const expires = stub();
expires.withArgs(TOKEN_WITH_EXP).returns(3);
expires.withArgs(TOKEN_WITHOUT_EXP).returns(false);

const expiresIn = proxyquire('../expires-in', {
  './get-expires': {
    default: expires
  }
}).default;

test('#expiresIn', t => {
  stub(Date, 'now');
  Date.now.returns(2);

  t.equals(expiresIn(TOKEN_WITH_EXP), 1, 'returns diff between expires and Date.now()');
  t.notOk(expiresIn(TOKEN_WITHOUT_EXP), `returns false when the token doesn't expire`);

  Date.now.restore();
  t.end();
});
