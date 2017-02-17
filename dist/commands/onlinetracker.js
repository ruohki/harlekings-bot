'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.OnlineTracker = undefined;

var _discord = require('discord.js');

var _discord2 = _interopRequireDefault(_discord);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

require('moment/locale/de');

var _bot = require('../bot');

var _util = require('../util.js');

var _models = require('../models.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const validChannel = ['253894698433773569', '253510173459480578', '253894883830530052'];

class OnlineTracker extends _bot.Command {
    constructor(...args) {
        var _temp;

        return _temp = super(...args), this.initialize = () => {
            if (process.env.MONGO) {

                this.Client.on('presenceUpdate', (oldUser, newUser) => {
                    if (oldUser.presence.game !== null) {

                        let nestedGameProp = `games.${oldUser.presence.game.name}`;
                        let queryObj = {
                            _id: newUser.id,
                            lastActive: Date.now(),
                            nickname: newUser.displayName
                        };
                        queryObj[nestedGameProp] = new Date().toISOString();

                        _models.MemberInfo.findOneAndUpdate({
                            _id: newUser.id
                        }, queryObj, { upsert: true }, (err, doc) => {
                            if (err) return (0, _util.LogMessage)('error', err);
                        });
                    } else {
                        _models.MemberInfo.findOneAndUpdate({
                            _id: newUser.id
                        }, {
                            _id: newUser.id,
                            lastActive: Date.now(),
                            nickname: newUser.displayName
                        }, { upsert: true }, (err, doc) => {
                            if (err) return (0, _util.LogMessage)('error', err);
                        });
                    }
                });

                this.Client.on('message', message => {
                    if (message.author.bot) return true;

                    let words = message.content.split(' ').length;
                    let chars = message.content.length;

                    _models.MemberInfo.findOneAndUpdate({
                        _id: message.author.id
                    }, {
                        _id: message.author.id,
                        lastActive: Date.now(),
                        $inc: {
                            chars,
                            words
                        }
                    }, { upsert: true }, (err, doc) => {
                        if (err) return (0, _util.LogMessage)('error', err);
                    });
                });
            }

            return process.env.MONGO ? true : false;
        }, this.executeCommand = message => {
            if (!validChannel.includes(message.channel.id)) {
                let channels = [];
                validChannel.map(channel => channels.push(`<#${channel}>`));

                message.channel.sendMessage(`Das Kommando ist hier nicht möglich. Nutze bitte ${channels.join(' ')}`);
                return true;
            }

            let pices = message.content.split(' ');
            if (pices.length > 1) {
                if (_validator2.default.isNumeric(pices[1])) {
                    _models.MemberInfo.findOne({
                        _id: pices[1]
                    }, (err, doc) => {
                        if (err) return (0, _util.LogMessage)('error', err);
                        if (doc) {
                            let lines = [`Member: ${doc.nickname}`, `Zuletzt aktiv am ${(0, _moment2.default)(doc.lastActive).locale('de').format('[**]DD. MMMM YYYY[**] [um] [**]HH:mm:ss[**]')}`];

                            Object.keys(doc.games).map((key, i) => {
                                lines.push(`${key} am ${(0, _moment2.default)(doc.games[key]).locale('de').format('[**]DD. MMMM YYYY[**] [um] [**]HH:mm:ss[**]')} - **${(0, _moment2.default)(doc.games[key]).locale('de').fromNow()}**`);
                            });

                            message.channel.sendMessage(lines.join('\r\n'));
                        } else {
                            message.channel.sendMessage(`Ich habe keine Daten zu diesen Member.`);
                        }
                    });
                } else {
                    _models.MemberInfo.find({
                        nickname: { '$regex': new RegExp(pices[1], "i") }
                    }, (err, docs) => {
                        if (err) return (0, _util.LogMessage)('error', err);
                        if (docs.length > 0) {
                            docs.map(doc => {
                                message.channel.sendMessage([`Member: ${doc.nickname}`, `Zuletzt aktiv am ${(0, _moment2.default)(doc.lastActive).locale('de').format('[**]DD. MMMM YYYY[**] [um] [**]HH:mm:ss[**]')}`].join('\r\n'));
                            });
                        } else {
                            message.channel.sendMessage(`Ich habe keine Daten zu diesen/diesem Member(n).`);
                        }
                    });
                }
            } else {
                message.channel.sendMessage('Bitte gib das Member an um das es geht. Entweder den Nickname, bzw Teile davon, oder die Snowflake.');
            }

            return true;
        }, _temp;
    }

    getParameter() {
        return {
            Aliases: ['status'],
            Help: '',
            SubCommands: {},

            hide: true,

            name: 'online_tracker',
            description: 'Hält die online offline zeit von Membern fest',
            author: 'Tillmann Hübner <ruohki@gmail.com>',

            version: {
                major: 0,
                minor: 1
            }
        };
    }

}
exports.OnlineTracker = OnlineTracker;