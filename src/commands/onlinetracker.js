import Discord from 'discord.js';
import request from 'request';

import mongoose from 'mongoose';
import validator from 'validator';

import moment from 'moment';
import 'moment/locale/de';

import { Command } from '../bot';
import { LogMessage } from '../util.js';

import  { MemberInfo }  from '../models.js';

const validChannel = [
    '253894698433773569',
    '253510173459480578',
    '253894883830530052'
]

export class OnlineTracker extends Command {  
    getParameter() {
        return {
            Aliases: ['status'],
            Help: '',
            SubCommands: {},            

            hide: true,

            name: 'online_tracker',
            description: 'Hält die online offline zeit von Membern fest',
            author: 'Tillmann Hübner <ruohki@gmail.com>',

            version: {
                major: 0,
                minor: 1
            }
        } 
    }

    initialize = () => {        
        if (process.env.MONGO) {                        

            this.Client.on('presenceUpdate', ( oldUser, newUser) => {                            
                if (oldUser.presence.game !== null) {
                    
                    let nestedGameProp = `games.${oldUser.presence.game.name}`
                    let queryObj = {
                        _id: newUser.id,
                        lastActive: Date.now(),
                        nickname: newUser.displayName,
                    }
                    queryObj[nestedGameProp] = new Date().toISOString()
                    
                    MemberInfo.findOneAndUpdate({
                        _id: newUser.id
                    }, queryObj, 
                    {upsert:true}, (err, doc) => {
                        if (err) return LogMessage('error', err);                            
                    });
                } else {
                    MemberInfo.findOneAndUpdate({
                        _id: newUser.id
                    }, {
                        _id: newUser.id,
                        lastActive: Date.now(),
                        nickname: newUser.displayName,                            
                    }, {upsert:true}, (err, doc) => {
                        if (err) return LogMessage('error', err);                            
                    });
                }
            });

            this.Client.on('message', message => {
                if (message.author.bot) return true;
                
                let words = message.content.split(' ').length;
                let chars = message.content.length;

                MemberInfo.findOneAndUpdate({
                    _id: message.author.id
                }, {
                    _id: message.author.id,   
                    lastActive: Date.now(),                                                             
                    $inc: {
                        chars,
                        words
                    }                        
                }, {upsert:true}, (err, doc) => {
                    if (err) return LogMessage('error', err);                            
                });
            });
                      
        }        

        return process.env.MONGO ? true : false;
    }

    executeCommand = ( message ) => {
        if (!validChannel.includes(message.channel.id)) {
            let channels = []
            validChannel.map( channel => channels.push(`<#${channel}>`));
            
            message.channel.sendMessage(`Das Kommando ist hier nicht möglich. Nutze bitte ${channels.join(' ')}`);
            return true;
        } 

        let pices = message.content.split(' ');
        if (pices.length > 1) {            
            if (validator.isNumeric(pices[1])) {
                MemberInfo.findOne({
                    _id: pices[1]
                }, (err, doc) => {
                    if (err) return LogMessage('error', err);
                    if (doc) {
                        let lines = [`Member: **${doc.nickname}**`,
                                     `Zuletzt aktiv am ${moment(doc.lastActive).locale('de').format('[**]DD. MMMM YYYY[**] [um] [**]HH:mm:ss[**]')}`]
                        
                        Object.keys(doc.games).map( (key, i) => {
                            lines.push(`${key} gespielt am ${moment(doc.games[key]).locale('de').format('[**]DD. MMMM YYYY[**] [um] [**]HH:mm:ss[**]')} - **${moment(doc.games[key]).locale('de').fromNow()}**`);
                        })

                        message.channel.sendMessage(lines.join('\r\n'));
                        
                    } else {
                        message.channel.sendMessage(`Ich habe keine Daten zu diesen Member.`);
                    }                    
                }); 
            } else {
                MemberInfo.find({
                    nickname: {'$regex': new RegExp(pices[1], "i")}
                }, (err, docs) => {
                    if (err) return LogMessage('error', err);
                    if (docs.length > 0) {
                        docs.map( (doc) => {
                            message.channel.sendMessage([`Member: **${doc.nickname}**`,
                                                         `Zuletzt aktiv am ${moment(doc.lastActive).locale('de').format('[**]DD. MMMM YYYY[**] [um] [**]HH:mm:ss[**]')}`].join('\r\n'));
                        });                             
                    } else {
                        message.channel.sendMessage(`Ich habe keine Daten zu diesen/diesem Member(n).`);
                    }   
                });                           
            }            
        } else {
            message.channel.sendMessage('Bitte gib das Member an um das es geht. Entweder den Nickname, bzw Teile davon, oder die Snowflake.');
        }

        return true;
    };
}