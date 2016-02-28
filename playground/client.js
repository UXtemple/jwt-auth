!function() {
  'use strict';

  console.group('welcome');
  console.log('Welcome to the jwt-auth playground');
  console.log('Access the library at window.jwtAuth');
  console.log('There\'s a playground endpoint at http://localhost:3000/playground');
  console.groupEnd('welcome');

  console.group('login');
  console.log('Logging in...', "jwtAuth.login('http://localhost:3000', 'user', 'password')");
  jwtAuth.login('http://localhost:3000', 'user', 'password')
    .then(function(token) {
      console.log('Logged in! Token', token);
      console.log('Running app!');
      console.groupEnd('login');
      app();
    })
    .catch(function(err) {
      console.error(err);
      console.groupEnd('login');
    });

  function getAuthContent(path) {
    console.group('authContent');
    var token = jwtAuth.getToken('http://localhost:3000');
    console.log('will try to get some authenticated content', "fetchAuth('http://localhost:3000" + path + "', 'Bearer " + token + "')");
    return fetchAuth('http://localhost:3000' + path, 'Bearer ' + token)
      .then(function(data) {
        console.log('success! data', data);
        console.groupEnd('authContent');
      })
      .catch(function(err) {
        console.error('boo', err);
        console.groupEnd('authContent');
      });
  }

  function app() {
    console.group('app');
    console.log('This is an app');

    var token = jwtAuth.getToken('http://localhost:3000');
    console.log('localStorage stored token', "jwtAuth.getToken('http://localhost:3000')", token);
    var expiresIn = jwtAuth.getExpiresIn(token);
    console.log('token expires in', "jwtAuth.getExpiresIn(token)", expiresIn);
    var seconds = Math.ceil(expiresIn / 1000);
    console.log('now, that\'s a unix timestamp, it really means', seconds, 'seconds');

    var interval = setInterval(function() {
      console.log(seconds--, 'seconds until renew');
    }, 1000);

    setTimeout(function() {
      clearInterval(interval);
      // this probably already happened but nevermind, it's ok for the example
      console.group('renew');
      console.log('checkout the network tab, you\'ll see the token been renewed');

      console.log('the old token was', token);
      var newToken = jwtAuth.getToken('http://localhost:3000');
      console.log('the new token is', newToken);

      console.log('they are different', token !== newToken);
      console.groupEnd('renew');

      console.group('logout');
      jwtAuth.logout('http://localhost:3000')
      console.log('now, say I log out', "jwtAuth.logout('http://localhost:3000')");
      console.log('a call to a protected resource will fail, see:');
      getAuthContent('/some-auth-path');
      console.groupEnd('logout');
      console.groupEnd('app');
    }, expiresIn + 1000);

    getAuthContent('/some-auth-path');
  }
}();
