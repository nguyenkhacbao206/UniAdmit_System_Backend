"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInterfaceIp = getInterfaceIp;
var _dgram = _interopRequireDefault(require("dgram"));
function getInterfaceIp(family) {
  return new Promise(function (resolve) {
    const host = family === 'IPv6' ? 'fd31:f903:5ab5:1::1' : '10.253.155.219';
    const socketType = family === 'IPv6' ? 'udp6' : 'udp4';
    const socket = _dgram.default.createSocket(socketType);
    socket.on('error', function () {
      socket.close();
      resolve(family === 'IPv6' ? '::1' : '127.0.0.1');
    });
    socket.on('close', function () {
      resolve(family === 'IPv6' ? '::1' : '127.0.0.1');
    });
    socket.connect(58162, host, function () {
      try {
        const address = socket.address().address;
        socket.close();
        resolve(address);
      } catch (err) {
        socket.close();
        resolve(family === 'IPv6' ? '::1' : '127.0.0.1');
      }
    });
  });
}