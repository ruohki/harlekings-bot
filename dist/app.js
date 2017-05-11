'use strict';

var _webserver = require('./webserver');

var _webserver2 = _interopRequireDefault(_webserver);

var _bot = require('./bot');

var _bot2 = _interopRequireDefault(_bot);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _util.LogMessage)('info', 'Harlekings Discord Bot starten...');

_mongoose2.default.connect(process.env.MONGO, { server: { auto_reconnect: true } });

let Mongo = _mongoose2.default.connection;
Mongo.on('error', error => (0, _util.LogMessage)('error', error));
Mongo.on('disconnected', () => _mongoose2.default.connect(process.env.MONGO, { server: { auto_reconnect: true } }));

// Bot Initialisieren und Starten
let bot = new _bot2.default();
bot.Init();

// WebServer für Heroku Starten
let webserver = new _webserver2.default(bot);
webserver.Serve();