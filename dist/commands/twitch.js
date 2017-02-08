'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TwitchTV = undefined;

var _discord = require('discord.js');

var _discord2 = _interopRequireDefault(_discord);

var _twitch = require('twitch.tv');

var _twitch2 = _interopRequireDefault(_twitch);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _bot = require('../bot');

var _util = require('../util.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const clientId = 'y8jx3f82gv6mnsg5zr7636amnbjrdn';
//const channelUrl = 'https://api.twitch.tv/kraken/streams/Harlekings_TV';
const channelUrl = 'https://api.twitch.tv/kraken/streams/leschtief';

class TwitchTV extends _bot.Command {
    constructor(...args) {
        var _temp;

        return _temp = super(...args), this.initialize = () => {
            console.log('init...');
            this.intervalHandle = setInterval(() => this.queryTwitch(this), 5000);

            return true;
        }, this.executeCommand = message => {
            console.log(this.twitchResponse);
            if (this.twitchResponse && this.twitchResponse.stream) {
                message.channel.sendMessage('Harlekings_TV is on bitches!');
            } else {
                message.channel.sendMessage('Auf Harlekings_TV wird gerade nicht gestreamed :(');
            }
            return true;
        }, _temp;
    }

    getParameter() {
        return {
            Aliases: ['twitch', 'stream'],
            Help: '<blank> oder [sub]',
            SubCommands: {
                status: 'gibt den aktuellen Status sowie Informationen zum Stream aus',
                viewer: 'gibt die Viewerzahl des Streams aus',
                link: 'gibt den Link zum Stream aus'
            },

            name: 'twitch',
            description: 'Gibt Informationen zum HarleKings Twitch Stream',
            author: 'Tillmann Hübner <ruohki@gmail.com>',

            version: {
                major: 0,
                minor: 1
            }
        };
    }

    queryTwitch(self) {
        (0, _twitch2.default)("streams/harlekings_tv", {
            apiVersion: 3,
            clientID: clientId
        }, (err, res) => {
            if (err) return console.log(err);

            self.twitchResponse = res;
        });

        /*request({
            url: channelUrl,            
            headers: {
                
                'Client-ID': clientId
            }            
        }, ( error, response, body) => {
            if (error) {
                return LogMessage('error', error);                
            }
            this.twitchResponse = JSON.parse(body);            
        }); */
    }

    /**
     * @param  {Discord.Message} message Discord Message
     */
}
exports.TwitchTV = TwitchTV;