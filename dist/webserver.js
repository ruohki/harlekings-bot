'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment/locale/de');

var _util = require('./util.js');

var _models = require('./models.js');

var _discord = require('discord.js');

var _discord2 = _interopRequireDefault(_discord);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class WebServer {
    /**
     * Erstellt eine neue Instanz des Webservers
     * @constructor
     */
    constructor(bot) {
        this.app = (0, _express2.default)();
        this.app.use(_bodyParser2.default.json());
        this.bot = bot;

        this.setupRoutes();
    }

    /**
     * Legt die Routen des Webservers fest
     */
    setupRoutes() {
        var _this = this;

        // Error Handling
        if (!this.app) throw new Error('WebServer nicht Initialisiert');

        this.app.post('/messageUser', (req, res) => {
            let { targetUser, targetMessage, passWord } = req.body;

            if (passWord !== "FroschFotze") {
                return res.json({ status: false });
            }
            try {
                this.bot.Client.fetchUser(targetUser, false).then(user => {
                    /*console.log(user);
                    const dmChannel = user.createDM();*/
                    user.send(targetMessage).then(message => console.log(`Sent message: ${message.content}`)).catch(console.error);

                    return res.json({ status: true });
                });
            } catch (err) {
                (0, _util.LogMessage)(err);
            }
        });

        this.app.post('/messageChannel', (req, res) => {
            let { targetChannel, targetMessage, passWord } = req.body;

            if (passWord !== "FroschFotze") {
                return res.json({ status: false });
            }
            let Channel = this.bot.Client.guilds.get('252815455096406017').channels.get(targetChannel);
            Channel.send(targetMessage);
            return res.json({ status: true });
        });

        this.app.post('/joinBewerber', (() => {
            var _ref = _asyncToGenerator(function* (req, res) {
                let { targetUser, token, passWord } = req.body;
                if (passWord !== "FroschFotze") {
                    return res.json({ status: false });
                }
                try {
                    let guild = yield _this.bot.Client.guilds.get('252815455096406017');
                    let user = yield _this.bot.Client.fetchUser(targetUser, false);
                    let guildMember = yield guild.addMember(user, { accessToken: token });
                    let roleResult = yield guildMember.addRole('272847394410856448');
                    return res.json({ status: roleResult });
                } catch (err) {
                    (0, _util.LogMessage)(err);
                }
            });

            return function (_x, _x2) {
                return _ref.apply(this, arguments);
            };
        })());
        // Man könnte hier jetzt jede menge module usw einbinden da der webserver aber nur für 
        // Heroku existiert halten wir es simpel

        this.app.get('/query', (req, res) => {
            let pice = req.query.user;
            if (_validator2.default.isNumeric(pice)) {
                _models.MemberInfo.findOne({
                    _id: pice
                }, (err, doc) => {
                    if (err) return (0, _util.LogMessage)('error', err);
                    if (doc) {

                        let games = [];
                        if (doc.games) {
                            Object.keys(doc.games).map((key, i) => {
                                games.push({ name: key, lastActive: (0, _moment2.default)(doc.games[key]).locale('de').format('DD. MMMM YYYY [um] HH:mm:ss') });
                            });
                        }

                        return res.json({ success: true, result: [{
                                member: doc.nickname,
                                lastActive: (0, _moment2.default)(doc.lastActive).locale('de').format('DD. MMMM YYYY [um] HH:mm:ss'),
                                games
                            }] });
                    } else {
                        return res.json({ success: false, result: 'member nicht gefunden' });
                    }
                });
            } else {
                _models.MemberInfo.find({
                    nickname: { '$regex': new RegExp(pice, "i") }
                }, (err, docs) => {
                    if (err) return (0, _util.LogMessage)('error', err);
                    if (docs.length > 0) {
                        let object = [];
                        docs.map(doc => {
                            object.push({
                                member: doc.nickname,
                                lastActive: (0, _moment2.default)(doc.lastActive).locale('de').format('DD. MMMM YYYY [um] HH:mm:ss')
                            });
                        });
                        return res.json({ success: true, result: object });
                    } else {
                        return res.json({ success: false, result: 'member nicht gefunden' });
                    }
                });
            }
        });
    }

    /**
     * Startet den WebServer
     */
    Serve() {
        this.server = this.app.listen(process.env.PORT || 4000, "0.0.0.0", () => {
            const host = this.server.address().address;
            const port = this.server.address().port;

            this.app.use(_express2.default.static('../web_root/'));

            (0, _util.LogMessage)('info', `WebServer gestartet: http://${host}:${port}`);
        });
    }
}
exports.default = WebServer;