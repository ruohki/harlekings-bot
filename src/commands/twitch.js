import Discord from 'discord.js';
import Twitch from 'twitch.tv';

import request from 'request';

import { Command } from '../bot';

import { LogMessage } from '../util.js';


const clientId = 'y8jx3f82gv6mnsg5zr7636amnbjrdn';
//const channelUrl = 'https://api.twitch.tv/kraken/streams/Harlekings_TV';
const channelUrl = 'https://api.twitch.tv/kraken/streams/leschtief';

export class TwitchTV extends Command {  
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
        } 
    }

    initialize = () => {
        console.log('init...');
        this.intervalHandle = setInterval(() => this.queryTwitch(this), 5000);

        return true;
    } 

    queryTwitch(self) {                  
        Twitch("streams/harlekings_tv", {
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
    executeCommand = ( message ) => {        
        if (this.twitchResponse && this.twitchResponse.stream) {
            message.channel.sendMessage('Harlekings_TV is on bitches!');
        } else {
            message.channel.sendMessage('Auf Harlekings_TV wird gerade nicht gestreamed :(');
        }
        return true;
    };
}