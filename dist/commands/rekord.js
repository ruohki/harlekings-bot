'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Gamble = undefined;

var _discord = require('discord.js');

var _discord2 = _interopRequireDefault(_discord);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _bot = require('../bot');

var _util = require('../util.js');

var _models = require('../models.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Gamble extends _bot.Command {
    constructor(...args) {
        var _temp;

        return _temp = super(...args), this.executeCommand = message => {

            let sub = message.content.split(' ', 2).length > 1 ? message.content.split(' ', 2)[1] : '';
            let author = message.guild.member(message.author);

            switch (sub) {
                case 'words':
                    _models.MemberInfo.find({}).sort('-words').limit(3).exec((err, docs) => {
                        if (err) return (0, _util.LogMessage)('error', err);
                        if (docs.length > 0) {
                            let topThree = [];
                            docs.map((doc, i) => {
                                topThree.push(`${i + 1}. ${doc.nickname} - **${doc.words}** Wörter.`);
                            });
                            message.channel.sendMessage(`Top 3 - Wörter\r\n${topThree.join('\r\n')}`);
                        } else {
                            message.channel.sendMessage(`Ich habe zu wenig Daten!`);
                        }
                    });
                    break;
                case 'chars':
                    _models.MemberInfo.find({}).sort('-chars').limit(3).exec((err, docs) => {
                        if (err) return (0, _util.LogMessage)('error', err);
                        if (docs.length > 0) {
                            let topThree = [];
                            docs.map((doc, i) => {
                                topThree.push(`${i + 1}. ${doc.nickname} - **${doc.chars}** Zeichen.`);
                            });
                            message.channel.sendMessage(`Top 3 - Zeichen\r\n${topThree.join('\r\n')}`);
                        } else {
                            message.channel.sendMessage(`Ich habe zu wenig Daten!`);
                        }
                    });
                    break;
                default:
                    _models.MemberInfo.findOne({
                        _id: message.author.id
                    }, (err, doc) => {
                        if (err) return (0, _util.LogMessage)('error', err);
                        if (doc) {
                            let words = doc.words || 0;
                            let chars = doc.chars || 0;
                            message.channel.sendMessage(`${message.author.toString()} du hast bisher ${words} Wörter und ${chars} Zeichen geschrieben.`);
                        } else {
                            message.channel.sendMessage(`${message.author.toString()} ich habe keine Daten zu dir.`);
                        }
                    });
                    break;
            }

            return true;
        }, _temp;
    }

    getParameter() {
        return {
            Aliases: ['rekord', 'record', 'top'],
            Help: '<blank>, [sub]',
            SubCommands: {
                'words': 'Gibt aus wer die meißten Wörter geschrieben hat.',
                'chars': 'Gibt aus wer die meißten Buchstaben und Zeichen geschriebene hat.'
            },

            name: 'rekord',
            description: 'Gibt Member rekorde aus.',
            author: 'Tillmann Hübner <ruohki@gmail.com>',

            version: {
                major: 0,
                minor: 1
            }
        };
    }

    /**
     * @param  {Discord.Message} message Discord Message
     */
}
exports.Gamble = Gamble;