import Discord from 'discord.js';
import request from 'request';

import { Command } from '../bot';

import { LogMessage } from '../util.js';

const isMorePowerful = (user, target) => user.highestRole.comparePositionTo(target.highestRole) >= 0 ? true : false;

const validChannel = [
    '273576847353053184'
]

export class Move extends Command {  
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
        } 
    }

    /**
     * @param  {Discord.Message} message Discord Message
     */
    executeCommand = ( message ) => {
        if (!validChannel.includes(message.channel.id)) {
            let channels = []
            validChannel.map( channel => channels.push(`<#${channel}>`));
            
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
    };
}