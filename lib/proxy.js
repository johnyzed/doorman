var httpProxy = require('http-proxy');
var conf = require('../conf');



var Proxy = module.exports = function(host, port) {
  this.host = host;
  this.port = port;
  this.target = "http://" + this.host + ":" + this.port;
  this.proxy = httpProxy.createProxyServer({xfwd: true});
};

Proxy.prototype.middleware = function() {
  var self = this;

  return function (req, res, next) {
    self.proxy.web(req, res, {
      target: self.target
    }, function(err) {
      if(err) {
        log.error("Backend error: " + err.message);
        res.writeHead(500, {});
        res.end('There was a backend error.');
      }
    });
  }
}

Proxy.prototype.proxyWebSocketRequest = function(req, socket, head) {
  this.proxy.ws(req,
                socket,
                head,
                { target: this.target });
};
