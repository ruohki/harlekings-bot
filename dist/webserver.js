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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class WebServer {
    /**
     * Erstellt eine neue Instanz des Webservers
     * @constructor
     */
    constructor() {
        this.app = (0, _express2.default)();
        this.app.use(_bodyParser2.default.json());

        this.setupRoutes();
    }

    /**
     * Legt die Routen des Webservers fest
     */
    setupRoutes() {
        // Error Handling
        if (!this.app) throw new Error('WebServer nicht Initialisiert');

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
                        let lastOffline = doc.offline || 0;
                        let lastOnline = doc.online || 0;

                        if (lastOffline > lastOnline) {
                            return res.json({ success: true, result: [{
                                    member: doc.nickname,
                                    offline: (0, _moment2.default)(doc.offline).locale('de').toNow(true)
                                }] });
                        } else {
                            return res.json({ success: true, result: [{
                                    member: doc.nickname,
                                    online: (0, _moment2.default)(doc.online).locale('de').toNow(true)
                                }] });
                        }
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
                            let lastOffline = doc.offline;
                            let lastOnline = doc.online;

                            if (lastOffline > lastOnline) {
                                object.push({
                                    member: doc.nickname,
                                    offline: (0, _moment2.default)(doc.offline).locale('de').toNow(true)
                                });
                            } else {
                                object.push({
                                    member: doc.nickname,
                                    online: (0, _moment2.default)(doc.online).locale('de').toNow(true)
                                });
                            }
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
        this.server = this.app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
            const host = this.server.address().address;
            const port = this.server.address().port;

            this.app.use(_express2.default.static('public'));

            (0, _util.LogMessage)('info', `WebServer gestartet: http://${host}:${port}`);
        });
    }
}
exports.default = WebServer;