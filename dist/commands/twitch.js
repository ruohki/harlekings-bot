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

const advertiseChannel = ['253510173459480578'];

const clientId = 'y8jx3f82gv6mnsg5zr7636amnbjrdn';
//const channelUrl = 'https://api.twitch.tv/kraken/streams/Harlekings_TV';
//const twitchChannelId = 'Harlekings_TV';
const twitchChannelId = 'slavexxx2';

class TwitchTV extends _bot.Command {
    constructor(...args) {
        var _temp;

        return _temp = super(...args), this.initialize = () => {
            this.twitchResponse = {
                stream: null
            };

            this.intervalHandle = setInterval(() => this.queryTwitch(this), 30000);

            return true;
        }, this.executeCommand = message => {
            let sub = message.content.split(' ', 2).length > 1 ? message.content.split(' ', 2)[1] : '';
            let author = message.guild.member(message.author);

            switch (sub) {
                case 'link':
                    //twitchChannelId
                    if (this.twitchResponse.stream !== null) {
                        message.channel.sendMessage(`Der ${twitchChannelId} Stream ist online! Schalte ein https://www.twitch.tv/${twitchChannelId}`);
                    } else {
                        message.channel.sendMessage(`Der ${twitchChannelId} Stream ist zur Zeit nicht online. Trotzdem ist hier der link https://www.twitch.tv/${twitchChannelId}`);
                    }
                    break;
                case 'viewer':
                    if (this.twitchResponse.stream !== null) {
                        message.channel.sendMessage(`Der ${twitchChannelId} Stream hat **${this.twitchResponse.stream.viewers}** Zuschauer!`);
                    } else {
                        message.channel.sendMessage(`Der ${twitchChannelId} Stream ist zur Zeit nicht online. :(`);
                    }
                    break;
                default:
                    if (this.twitchResponse.stream !== null) {
                        let embed = this.getEmbed(this.twitchResponse);
                        message.channel.sendEmbed(embed);
                    } else {
                        message.channel.sendMessage(`Der ${twitchChannelId} Stream ist zur Zeit nicht online. :(`);
                    }
                    break;
            }
            return true;
        }, _temp;
    }

    getParameter() {
        return {
            Aliases: ['twitch', 'stream'],
            Help: '<blank> oder [sub]',
            SubCommands: {
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
        (0, _twitch2.default)(`streams/${twitchChannelId}`, {
            apiVersion: 3,
            clientID: clientId
        }, (err, res) => {
            if (err) return console.log(err);
            console.log(Date.now().toString());
            console.log(res);
            if (res.stream === null && this.twitchResponse.stream !== null) {
                // -> Offline 
                advertiseChannel.map(channelId => {
                    let channel = this.Client.guilds.get('252815455096406017').channels.get(channelId);
                    channel.sendMessage(`Danke an alle die Eingeschaltet haben. Vorallem die ${this.twitchResponse.stream.viewers} die bis zuletzt dabei waren! Stream ist jetzt Offline.`);
                });
            } else if (res.stream !== null && this.twitchResponse.stream === null) {
                // -> Online
                advertiseChannel.map(channelId => {
                    let channel = this.Client.guilds.get('252815455096406017').channels.get(channelId);

                    let embed = this.getEmbed(res);
                    channel.sendEmbed(embed, '@everyone');
                });
            }

            self.twitchResponse = res;
        });
    }

    getEmbed(data) {
        return new _discord2.default.RichEmbed().setTitle('Wir sind [LIVE]')
        /*
        * Alternatively, use '#00AE86', [0, 174, 134] or an integer number.
        */
        .setColor(0x2776DC).setDescription(data.stream.channel.status).setFooter(data.stream.channel.url, data.stream.channel.url).setImage(data.stream.preview.large).setThumbnail(data.stream.channel.logo)
        /*
        * Takes a Date object, defaults to current date.
        */
        .setTimestamp().setURL(data.stream.channel.url).addField('Spiel', data.stream.game).addField('Zuschauer', data.stream.viewers).addField('Follower', data.stream.channel.followers);
    }
    /**
     * @param  {Discord.Message} message Discord Message
     */
}
exports.TwitchTV = TwitchTV;