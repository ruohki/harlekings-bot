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
                    if (newUser.presence.status === "offline") {
                        _models.MemberInfo.findOneAndUpdate({
                            _id: newUser.id
                        }, {
                            _id: newUser.id,
                            offline: Date.now(),
                            nickname: newUser.displayName
                        }, { upsert: true }, (err, doc) => {
                            if (err) return (0, _util.LogMessage)('error', err);
                        });
                    } else if (newUser.presence.status === "online") {
                        _models.MemberInfo.findOneAndUpdate({
                            _id: newUser.id
                        }, {
                            _id: newUser.id,
                            online: Date.now(),
                            nickname: newUser.displayName
                        }, { upsert: true }, (err, doc) => {
                            if (err) return (0, _util.LogMessage)('error', err);
                        });
                    }
                });
            }

            return process.env.MONGO ? true : false;
        }, this.executeCommand = message => {
            /*message.guild.members.map( (member) => {
                let start = new Date();
                    start.setHours(0,0,0,0);
                if (member.presence.status === 'offline') {
                    MemberInfo.findOneAndUpdate({
                        _id: member.id
                    }, {
                        _id: member.id, 
                        online: start,               
                        offline: Date.now(),                    
                        nickname: member.displayName
                    }, {upsert:true}, (err, doc) => {
                        if (err) return LogMessage('error', err);                            
                    });
                } else {
                    
                    MemberInfo.findOneAndUpdate({
                        _id: member.id
                    }, {
                        _id: member.id,                
                        online: Date.now(), 
                        offline: start,                
                        nickname: member.displayName
                    }, {upsert:true}, (err, doc) => {
                        if (err) return LogMessage('error', err);                            
                    });
                }
            });*/

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
                            let lastOffline = doc.offline || 0;
                            let lastOnline = doc.online || 0;

                            if (lastOffline > lastOnline) {
                                message.channel.sendMessage([`Member: ${doc.nickname}`, `*Offline* seit **${(0, _moment2.default)(doc.offline).locale('de').toNow(true)}**`].join('\r\n'));
                            } else {
                                message.channel.sendMessage([`Member: ${doc.nickname}`, `**Online** seit **${(0, _moment2.default)(doc.online).locale('de').toNow(true)}**`].join('\r\n'));
                            }
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
                                let lastOffline = doc.offline;
                                let lastOnline = doc.online;

                                if (lastOffline > lastOnline) {
                                    message.channel.sendMessage([`Member: ${doc.nickname}`, `*Offline* seit **${(0, _moment2.default)(doc.offline).locale('de').toNow(true)}**`].join('\r\n'));
                                } else {
                                    message.channel.sendMessage([`Member: ${doc.nickname}`, `**Online** seit **${(0, _moment2.default)(doc.online).locale('de').toNow(true)}**`].join('\r\n'));
                                }
                            });
                        } else {
                            message.channel.sendMessage(`Ich habe keine Daten zu diesen/diesen Member(n).`);
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