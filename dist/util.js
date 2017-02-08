'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LogMessage = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Logger Methode die die Konsolenausgabe formatiert
 * @param  {String} level Das Logger Level zb. info, warn, error
 * @param  {String} message Die Logger Nachricht
 */
const LogMessage = exports.LogMessage = (level = 'info', message) => {
  let now = (0, _moment2.default)().format('DD.MM.YYYY-HH:mm:ss');
  console.log(`[${now}][${level}] ${message}`);
};