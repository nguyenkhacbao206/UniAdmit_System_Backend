"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _cron = require("cron");
var _configs = require("../configs");
var _helpers = require("../utils/helpers");
const runEveryDay = _cron.CronJob.from({
  cronTime: '0 0 0 * * *',
  onTick: async function (onComplete) {
    try {
      console.log('You will see this message every day 12 AM.');
    } catch (error) {
      _configs.logger.error({
        message: 'Error running run-every-day task',
        detail: (0, _helpers.normalizeError)(error)
      });
    }
    if (onComplete) await onComplete();
  }
});
var _default = exports.default = runEveryDay;
if (require.main === module) {
  _configs.db.connect().then(function () {
    runEveryDay.onComplete = _configs.db.close;
    runEveryDay.fireOnTick();
  });
}