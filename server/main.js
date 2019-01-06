'use strict';

const g_constants = require('./constants');

const http = require('http');
const https = require('https');
const util = require('util');
const express = require('express');
const bodyParser = require('body-parser');
const WebSocketServer = require('ws').Server;
const helmet = require('helmet')
const hsts = require('hsts')
const redisClient = require('redis').createClient();
const app = express();
const crossdomain = require('helmet-crossdomain')
const hpkp = require('hpkp')
const csp = require('helmet-csp')
const forceDomain = require('forcedomain');



const log_file = require("fs").createWriteStream(__dirname + '/debug.log', {flags : 'w'});
const log_stdout = process.stdout;
const limiter = require('express-limiter')(app, redisClient);
console.log = function(d, userID) { 
    if (!g_constants.DEBUG_LOG)
        return;

  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
  
  if (userID)
    require("./utils").log_user(userID, d);
};


app.use(forceDomain({
  hostname: 'www.enmanet.com'
}));

app.use(hsts({
  maxAge: 15552000  // 180 days in seconds
}))
app.use(helmet())
app.disable('x-powered-by')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.use(csp({
  // Specify directives as normal.
  directives: {
    defaultSrc: ["'self'", 'enmanet.com'],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    sandbox: ['allow-forms', 'allow-scripts'],
    reportUri: '/report-violation',
    objectSrc: ["'none'"],
    upgradeInsecureRequests: true,
    workerSrc: false  // This is not set.
  },

  // This module will detect common mistakes in your directives and throw errors
  // if it finds any. To disable this, enable "loose mode".
  loose: false,

  // Set to true if you only want browsers to report errors, not block them.
  // You may also set this to a function(req, res) in order to decide dynamically
  // whether to use reportOnly mode, e.g., to allow for a dynamic kill switch.
  reportOnly: false,

  // Set to true if you want to blindly set all headers: Content-Security-Policy,
  // X-WebKit-CSP, and X-Content-Security-Policy.
  setAllHeaders: false,

  // Set to true if you want to disable CSP on Android where it can be buggy.
  disableAndroid: false,

  // Set to false if you want to completely disable any user-agent sniffing.
  // This may make the headers less compatible but it will be much faster.
  // This defaults to `true`.
  browserSniff: true
}))






app.set('forceSSLOptions', {
  enable301Redirects: true,
  trustXFPHeader: false,
  httpsPort: 443,
  sslRequiredMessage: 'SSL Required.'
});

// Sets X-Permitted-Cross-Domain-Policies: none
app.use(crossdomain())

// You can use any of the following values:
app.use(crossdomain({ permittedPolicies: 'master-only' }))


//app.use(cookieParser());


// Limit requests to 100 per hour per ip address.
limiter({
  lookup: ['connection.remoteAddress'],
  total: 100,
  expire: 1000 * 60 * 60
})

const ninetyDaysInSeconds = 7776000
app.use(hpkp({
  maxAge: ninetyDaysInSeconds,
  sha256s: ['INSERT_VALID_HPKP_HASH', 'INSERT_VALID_KPKP_HASH'],
  includeSubDomains: true,         // optional
  reportUri: 'http://enmanet.com', // optional
  reportOnly: false,               // optional

  // Set the header based on a condition.
  // This is optional.
  setIf(req, res) {
    return req.secure
  }
}))


var compression = require('compression')

// compress all responses
app.use(compression())

var httpServer = http.createServer(app);
var httpsServer = https.createServer(g_constants.SSL_options, app);

var httpListener = httpServer.listen(g_constants.my_port);
var httpsListener = httpsServer.listen(g_constants.share.my_portSSL, function(){
    console.log("SSL Proxy listening on port "+g_constants.share.my_portSSL);
});

var lastSocketKey = 0;
var socketMap = {http: {}, https: {}};
httpListener.on('connection', function(socket) {
    /* generate a new, unique socket-key */
    const socketKey = ++lastSocketKey;
    /* add socket when it is connected */
    socketMap.http[socketKey] = socket;
    socket.on('close', function() {
        /* remove socket when it is closed */
        g_constants.ReleaseAddress(socketMap.http[socketKey].remoteAddress);
        delete socketMap.http[socketKey];
    });
    
    if (!g_constants.IsAllowedAddress(socket.remoteAddress))
        socket.end();
});

httpsListener.on('connection', function(socket) {
    /* generate a new, unique socket-key */
    const socketKey = ++lastSocketKey;
    /* add socket when it is connected */
    socketMap.https[socketKey] = socket;
    socket.on('close', function() {
        /* remove socket when it is closed */
        g_constants.ReleaseAddress(socketMap.https[socketKey].remoteAddress);
        delete socketMap.https[socketKey];
    });
    
    if (!g_constants.IsAllowedAddress(socket.remoteAddress))
        socket.end();
});

//httpListener.on('error', () => {});
//httpsListener.on('error', () => {});

g_constants.WEB_SOCKETS = new WebSocketServer({ server: httpsServer, clientTracking: true });

function noop() {}
 
setInterval(function ping() {
  g_constants.WEB_SOCKETS.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();
 
    ws.isAlive = false;
    ws.ping(noop);
  });
}, 30000);
 
app.use(express.static('../static_pages'));
app.set('view engine', 'ejs');

//require('./reqHandler.js').handle(app, g_constants.WEB_SOCKETS);

/*process.on('uncaughtException', function (err) {
  console.error(err.stack);
  utils.balance_log(err.stack+"\n");
  console.log("Node NOT Exiting...");
});*/

app.use((err, req, res, next) => {
    res.send(500, 'Something broke!');
});

//console.log(JSON.stringify(process.versions));
require("./database").Init(() => {
    require("./modules/users/market").Init();
    require('./reqHandler.js').handle(app, g_constants.WEB_SOCKETS);
});
//require("./modules/users/market").Init();



