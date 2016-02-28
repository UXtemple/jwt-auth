import { spy } from 'sinon';
import logout from '../logout';
import test from 'tape';

const ENDPOINT = 'endpoint';
const localStorage = {
  removeItem: spy()
};

test('#logout', t => {
  global.localStorage = localStorage;

  logout(ENDPOINT);
  t.equals(localStorage.removeItem.args[0][0], ENDPOINT, 'removes token from localStorage');

  delete global.localStorage;
  t.end();
});
