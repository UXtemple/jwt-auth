import { stub } from 'sinon';
import proxyquire from 'proxyquire';
import test from 'tape';

const TOKEN_WITH_EXP = 'exp';
const TOKEN_WITHOUT_EXP = 'no-exp';

const getExpires = stub();
getExpires.withArgs(TOKEN_WITH_EXP).returns(3);
getExpires.withArgs(TOKEN_WITHOUT_EXP).returns(false);

const getExpiresIn = proxyquire('../get-expires-in', {
  './get-expires': {
    default: getExpires
  }
}).default;

test('#getExpiresIn', t => {
  stub(Date, 'now');
  Date.now.returns(2);

  t.equals(getExpiresIn(TOKEN_WITH_EXP), 1, 'returns diff between expires and Date.now()');
  t.notOk(getExpiresIn(TOKEN_WITHOUT_EXP), `returns false when the token doesn't expire`);

  Date.now.restore();
  t.end();
});
