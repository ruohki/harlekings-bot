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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const validChannel = ['273908295654440960'];

class Gamble extends _bot.Command {
    constructor(...args) {
        var _temp;

        return _temp = super(...args), this.executeCommand = message => {
            if (!validChannel.includes(message.channel.id)) {
                let channels = [];
                validChannel.map(channel => channels.push(`<#${channel}>`));

                message.channel.sendMessage(`Du kannst hier nicht Spielen. Nutze bitte ${channels.join(' ')}`);
                return true;
            }

            let payload = message.content.split(' ', 2).length > 1 ? message.content.split(' ', 2)[1] : '';
            let author = message.guild.member(message.author);
            if (payload.match(/^[0-9]*$/) && payload !== '') {
                let max = parseInt(payload);
                let number = Math.floor(Math.random() * max) + 1;

                message.channel.sendMessage(`${author.toString()} hat eine **${number}** gewürfelt [1-${max}] :game_die: `);
            } else if (payload.match(/^[0-9]{1,}\-[0-9]{1,}$/)) {
                let minmax = payload.split('-');

                let min = Math.min(parseInt(minmax[0]), parseInt(minmax[1]));
                let max = Math.max(parseInt(minmax[0]), parseInt(minmax[1]));

                let number = Math.floor(Math.random() * (max - min + 1)) + min;

                message.channel.sendMessage(`${author.toString()} hat eine **${number}** gewürfelt [${min}-${max}] :game_die: `);
            } else {
                let number = Math.floor(Math.random() * 100) + 1;
                message.channel.sendMessage(`${author.toString()} hat eine **${number}** gewürfelt [1-100] :game_die: `);
            }

            return true;
        }, _temp;
    }

    getParameter() {
        return {
            Aliases: ['roll', 'rnd', 'rand', 'random'],
            Help: '<blank>, [max] oder [min]-[max]',
            SubCommands: {
                '1': '[max] Würfelt von 1 bis zur angegebenen Zahl',
                '2': '[min-max] Würfelt vom minimum bis zum maximum.'
            },

            name: 'gamble',
            description: 'Würfelt von 1-100 oder im angegebenen Bereich.',
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