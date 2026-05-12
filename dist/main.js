"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _sourceMapSupport = _interopRequireDefault(require("source-map-support"));
var _child_process = require("child_process");
var _configs = require("./configs");
var _ = _interopRequireDefault(require("."));
var _tasks = _interopRequireDefault(require("./tasks"));
var _helpers = require("./utils/helpers");
_sourceMapSupport.default.install();
const host = process.env.HOST || 'localhost';
const port = parseInt(process.env.PORT, 10) || 3456;
const app = (0, _.default)();
_configs.db.connect().then(() => console.log('Database connection successful!'));
app.listen(port, host, async function () {
  let displayHostname = host;
  if (['0.0.0.0', '::'].includes(host)) {
    if (host === '0.0.0.0') {
      displayHostname = await (0, _helpers.getInterfaceIp)('IPv4');
    } else {
      displayHostname = await (0, _helpers.getInterfaceIp)('IPv6');
    }
  }
  if (host.includes(':')) {
    displayHostname = `[${displayHostname}]`;
  }
  console.log(`Server is running on http://${displayHostname}:${port} in ${app.settings.env} mode.`);
});
(0, _tasks.default)();
if (process.env.__ESLINT__ === 'true') {
  const command = 'npm';
  const args = ['run', 'lint:fix', '--silent'];
  const options = {
    stdio: 'inherit',
    shell: true
  };
  const eslintProcess = (0, _child_process.spawn)(command, args, options);
  eslintProcess.on('close', function (code) {
    if (code !== 0) process.exit(1);
  });
}