'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Move = undefined;

var _discord = require('discord.js');

var _discord2 = _interopRequireDefault(_discord);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _bot = require('../bot');

var _util = require('../util.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isMorePowerful = (user, target) => user.highestRole.comparePositionTo(target.highestRole) >= 0 ? true : false;

const validChannel = ['273576847353053184'];

class Move extends _bot.Command {
    constructor(...args) {
        var _temp;

        return _temp = super(...args), this.executeCommand = message => {
            if (!validChannel.includes(message.channel.id)) {
                let channels = [];
                validChannel.map(channel => channels.push(`<#${channel}>`));

                message.channel.sendMessage(`Das Kommando ist hier nicht möglich. Nutze bitte ${channels.join(' ')}`);
                return true;
            }

            let userOne = message.guild.member(message.mentions.users.first());

            if (userOne) {
                let author = message.guild.member(message.author);

                if (userOne.voiceChannel.permissionsFor(author).hasPermission('CONNECT')) {
                    author.setVoiceChannel(userOne.voiceChannel);
                } else {
                    message.author.sendMessage('Du hast nicht die Berechtigung diesem Channel zu joinen.');
                }
            } else {
                message.author.sendMessage('Du hast kein Member angegeben. Nutze dazu einfach @nickname.');
            }

            return true;
        }, _temp;
    }

    getParameter() {
        return {
            Aliases: ['move', 'join', 'switch'],
            Help: '[person]',
            SubCommands: {},

            name: 'move',
            description: 'Moved dich zum angegebenen Member.',
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
exports.Move = Move;