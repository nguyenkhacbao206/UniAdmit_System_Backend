"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addClient = addClient;
exports.default = void 0;
exports.removeClient = removeClient;
exports.sendToUser = sendToUser;
const clients = new Map();
function addClient(userId, res) {
  clients.set(String(userId), res);
}
function removeClient(userId) {
  clients.delete(String(userId));
}
function sendToUser(userId, data) {
  const res = clients.get(String(userId));
  if (res) {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}
var _default = exports.default = {
  addClient,
  removeClient,
  sendToUser
};