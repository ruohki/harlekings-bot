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
        
            if (author.voiceChannel) {
                if (message.mentions.everyone && (message.guild.owner === author)) {
                    message.guild.members.map( user => {
                        let guildMember = message.guild.member(user);
                        if (guildMember.voiceChannel) {
                            if (isMorePowerful(author, guildMember)) {
                                guildMember.setVoiceChannel(author.voiceChannel);
                            }
                        }                    
                    }); 
                } else {
                   
                    message.mentions.users.map( user => {
                        let guildMember = message.guild.member(user);
                        if (guildMember.voiceChannel) {
                            if (isMorePowerful(author, guildMember)) {
                                guildMember.setVoiceChannel(author.voiceChannel).catch(err => LogMessage('error', err)) ;
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
    };
}