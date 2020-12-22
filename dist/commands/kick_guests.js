'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.KickGuests = undefined;

var _discord = require('discord.js');

var _discord2 = _interopRequireDefault(_discord);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _bot = require('../bot');

var _util = require('../util.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class KickGuests extends _bot.Command {
    constructor(...args) {
        var _temp;

        return _temp = super(...args), this.initialize = () => {
            this.Client.on('presenceUpdate', (oldUser, newUser) => {
                if (newUser.presence.status === "offline" && newUser.roles.size <= 1) {
                    newUser.sendMessage('Du wirst vom HarleKings Discord *entfernt*. Grund: Gäste dürfen bei uns **NICHT** idlen, unsichtbar oder offline sein. Stelle deinen Status auf **online** und verbinde dich erneut über https://discordapp.com/invite/2RaUZZ3.');
                    setTimeout(() => newUser.kick(), 1000);
                }
            });

            return true;
        }, _temp;
    }

    getParameter() {
        return {
            Aliases: [],
            Help: '',
            SubCommands: {},

            name: 'kick_guests',
            description: 'Kick regeläßig Gäste vom Discord. Byebye Scumm',
            author: 'Tillmann Hübner <ruohki@gmail.com>',

            version: {
                major: 0,
                minor: 1
            }
        };
    }

}
exports.KickGuests = KickGuests;