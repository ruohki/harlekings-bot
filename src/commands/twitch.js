import Discord from 'discord.js';
import Twitch from 'twitch.tv';
import uuidV4 from 'uuid/v4';

import request from 'request';

import { Command } from '../bot';

import { LogMessage } from '../util.js';

const advertiseChannel = [
    /*'253510173459480578'*/
    '252815455096406017',       // Allgemein
    /*'273811577768116224'      // Twitch Kanal */
]

const clientId = 'y8jx3f82gv6mnsg5zr7636amnbjrdn';
//const channelUrl = 'https://api.twitch.tv/kraken/streams/Harlekings_TV';
const twitchChannelId = 'Harlekings_TV';
//const twitchChannelId = 'slavexxx2';

export class TwitchTV extends Command {  
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
        } 
    }

    initialize = () => {        
        this.twitchResponse = { 
            stream: null
        }

        if (!this.intervalHandle) {
            this.intervalHandle = setInterval(() => this.queryTwitch(this), 60000);
        }

        return true;
    } 

    queryTwitch(self) {                  
        Twitch(`streams/${twitchChannelId}`, {
            apiVersion: 3,
            clientID: clientId
        }, (err, res) => {
            if (err) return console.log(err);
            //console.log(Date.now().toString())
            //console.log(res);
            if (res.stream === null && this.twitchResponse.stream !== null) {
                // -> Offline 
                advertiseChannel.map( channelId => {
                    let channel = this.Client.guilds.get('252815455096406017').channels.get(channelId)
                    channel.sendMessage(`Danke an alle die Eingeschaltet haben. Vorallem die ${this.twitchResponse.stream.viewers} die bis zuletzt dabei waren! Stream ist jetzt Offline.`)
                })
            }  else if (res.stream !== null && this.twitchResponse.stream === null) {
                // -> Online
                advertiseChannel.map( channelId => {
                    let channel = this.Client.guilds.get('252815455096406017').channels.get(channelId)

                    let embed = this.getEmbed(res);
                    channel.sendEmbed(embed, "@everyone");
                });
            }

            self.twitchResponse = res;
        });    
    }
    
    getEmbed(data) {

        return new Discord.RichEmbed()
            .setTitle('Wir sind [LIVE]')                        
            /*
            * Alternatively, use '#00AE86', [0, 174, 134] or an integer number.
            */
            .setColor(0x2776DC)
            .setDescription(data.stream.channel.status)
            .setFooter(data.stream.channel.url, data.stream.channel.url)
            .setImage(`http://ruohki.de/twitch/${uuidV4()}`)
            .setThumbnail(data.stream.channel.logo)
            /*
            * Takes a Date object, defaults to current date.
            */
            .setTimestamp()
            .setURL(data.stream.channel.url)
            .addField('Spiel', data.stream.game)
            .addField('Zuschauer', data.stream.viewers)
            .addField('Follower', data.stream.channel.followers)
    }
    /**
     * @param  {Discord.Message} message Discord Message
     */
    executeCommand = ( message ) => {
        let sub = message.content.split(' ', 2).length > 1 ? message.content.split(' ', 2)[1] : '';
        let author =  message.guild.member(message.author);

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
    };
}