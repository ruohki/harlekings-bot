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

                if (author.voiceChannel) {
                    if (message.mentions.everyone && message.guild.owner === author) {
                        message.guild.members.map(user => {
                            let guildMember = message.guild.member(user);
                            if (guildMember.voiceChannel) {
                                if (isMorePowerful(author, guildMember)) {
                                    guildMember.setVoiceChannel(author.voiceChannel);
                                }
                            }
                        });
                    } else {

                        message.mentions.users.map(user => {
                            let guildMember = message.guild.member(user);
                            if (guildMember.voiceChannel) {
                                if (isMorePowerful(author, guildMember)) {
                                    guildMember.setVoiceChannel(author.voiceChannel).catch(err => (0, _util.LogMessage)('error', err));
                                } else {
                                    message.author.sendMessage(`Dir fehlen die Rechte um \`${guildMember.nickname}\` zu moven.`);
                                }
                            } else {
                                message.author.sendMessage(`\`${guildMember.nickname}\` befindet sich nicht im Voice Chat.`);
                            }
                        });
                    }
                } else {
                    message.author.sendMessage('Du bist in keinem Voice Channel.');
                }
            } else {
                message.author.sendMessage('Du hast kein Member angegeben. Nutze dazu einfach @nickname.');
            }

            return true;
        }, _temp;
    }

    getParameter() {
        return {
            Aliases: ['gief', 'bringme', 'iwant', 'give'],
            Help: '[person]',
            SubCommands: {},

            name: 'gief',
            description: 'Moved das angegebene Member zu dir.',
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