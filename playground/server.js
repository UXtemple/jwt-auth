var atob = require('atob');
var btoaUrl = require('base64url').encode;
var read = require('fs').readFileSync;

var EXPIRES_IN = 10000;
var FILES = {
  '/': read(__dirname + '/index.html'),
  '/fetch-auth.js': read(__dirname + '/../node_modules/fetch-auth/es5.js'),
  '/jwt-auth.js': read(__dirname + '/../es5.js'),
  '/client.js': read(__dirname + '/client.js')
};
var IS_BASIC = /^Basic\s+(.+)/;
var IS_BEARER = /^Bearer\s+(.+)/;
var PAYLOAD = /header\.(.+)\.signature/;

require('http').createServer(function(req, res) {
  var auth = req.headers.Authorization || req.headers.authorization || '';
  var headers = {};
  var status = 404;
  var end;

  console.log(new Date().getSeconds() + 's --> ' + req.method + ' ' + req.url + ' ' + auth);

  if (req.url === '/') {
    if (req.method === 'POST') {
      if (IS_BASIC.test(auth) || IS_BEARER.test(auth)) {
        headers = {'Content-Type': 'application/json'};
        status = 200;

        var user = IS_BASIC.test(auth) ?
          atob(auth.match(IS_BASIC)[1]).split(':')[0] :
          JSON.parse(atob(auth.match(PAYLOAD)[1])).user;

        var payload = JSON.stringify({
          accessed: Date.now(),
          user: user,
          exp: Date.now() + EXPIRES_IN
        });

        end = JSON.stringify('header.' + btoaUrl(payload) + '.signature');
      } else {
        status = 401;
      }
    } else if (req.method === 'GET') {
      // serve index.html
      status = 200;
      headers = {'Content-Type': 'text/html'};
      end = FILES[req.url];
    }
  } else {
    if (IS_BEARER.test(auth)) {
      try {
        var payload = JSON.parse(atob(auth.match(PAYLOAD)[1]));
        end = JSON.stringify({
          accessed: Date.now(),
          url: req.url,
          user: payload.user
        });
        headers = {'Content-Type': 'application/json'};
        status = 200;
      } catch(err) {
        status = 401;
      }
    } else if (req.method === 'GET' && FILES[req.url]) {
      status = 200;
      headers = {'Content-Type': 'text/javascript'};
      end = FILES[req.url];
    }
  }

  console.log('   <-- ' + status + ' ' + (headers['Content-Type'] === 'application/json' ? end : ''));
  res.writeHead(status, headers);
  res.end(end);
}).listen(3000);

console.log('jwt-auth playground running at http://localhost:3000');
