import { stub } from 'sinon';
import getExpires from '../get-expires';
import test from 'tape';

const EXP = 2;
const EXP_MS = EXP * 1000;

const PAYLOAD_WITH_EXP = 'payload-with-exp';
const PAYLOAD_WITH_INVALID_JSON = 'payload-with-invalid-json';
const PAYLOAD_WITHOUT_EXP = 'payload-without-exp';

const TOKEN_WITH_EXP = `header.${PAYLOAD_WITH_EXP}.signature`;
const TOKEN_WITH_INVALID_JSON = `header.${PAYLOAD_WITH_INVALID_JSON}.signature`;
const TOKEN_WITHOUT_EXP = `header.${PAYLOAD_WITHOUT_EXP}.signature`;

const atob = stub();
atob.withArgs(PAYLOAD_WITH_EXP).returns(`{"exp": ${EXP}}`);
atob.withArgs(PAYLOAD_WITH_INVALID_JSON).returns(`"`);
atob.withArgs(PAYLOAD_WITHOUT_EXP).returns(`{}`);

test('#getExpires', t => {
  global.atob = atob;

  t.equals(getExpires(TOKEN_WITH_EXP), EXP_MS, 'returns expiration when it exists');
  t.notOk(getExpires(TOKEN_WITHOUT_EXP), `returns false when the token doesn't expire`);

  t.throws(() => getExpires(TOKEN_WITH_INVALID_JSON), 'throws when JSON in payload is invalid');
  t.throws(() => getExpires('invalid-token'), `throws when token's format is invalid`);

  delete global.atob;
  t.end();
});
