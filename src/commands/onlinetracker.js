import Discord from 'discord.js';
import request from 'request';

import mongoose from 'mongoose';
import validator from 'validator';

import moment from 'moment';
import 'moment/locale/de';

import { Command } from '../bot';
import { LogMessage } from '../util.js';

const Schema = mongoose.Schema;
let MemberInfoSchema = new Schema({
    _id: String,
    online: Date,
    offline: Date,
    nickname: String
});
MemberInfoSchema.virtual('snowflake').get(function() { return this._id; });
const MemberInfo = mongoose.model('Memberinfo', MemberInfoSchema);

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
        let self = this;
        if (process.env.MONGO) {                        
            mongoose.connect(process.env.MONGO, {server:{auto_reconnect:true}});                        
            const Mongo = mongoose.connection;

            Mongo.on('error', error => LogMessage('error', error));
            Mongo.on('disconnected', () => mongoose.connect(process.env.MONGO, {server:{auto_reconnect:true}}));

            Mongo.once('open', () => {
                self.Client.on('presenceUpdate', ( oldUser, newUser) => {            
                    if ( (newUser.presence.status === "offline") ) {            
                        MemberInfo.findOneAndUpdate({
                            _id: newUser.id
                        }, {
                            _id: newUser.id,
                            offline: Date.now(),
                            nickname: newUser.displayName
                        }, {upsert:true}, (err, doc) => {
                            if (err) return LogMessage('error', err);                            
                        });
                    } else if ( (newUser.presence.status === "online")) {
                        MemberInfo.findOneAndUpdate({
                            _id: newUser.id
                        }, {
                            _id: newUser.id,
                            online: Date.now(),
                            nickname: newUser.displayName
                        }, {upsert:true}, (err, doc) => {
                            if (err) return LogMessage('error', err);                            
                        });
                    }
                });
            });            
        }        

        return process.env.MONGO ? true : false;
    }

    executeCommand = ( message ) => {
        /*message.guild.members.map( (member) => {
            let start = new Date();
                start.setHours(0,0,0,0);
            if (member.presence.status === 'offline') {
                MemberInfo.findOneAndUpdate({
                    _id: member.id
                }, {
                    _id: member.id, 
                    online: start,               
                    offline: Date.now(),                    
                    nickname: member.displayName
                }, {upsert:true}, (err, doc) => {
                    if (err) return LogMessage('error', err);                            
                });
            } else {
                
                MemberInfo.findOneAndUpdate({
                    _id: member.id
                }, {
                    _id: member.id,                
                    online: Date.now(), 
                    offline: start,                
                    nickname: member.displayName
                }, {upsert:true}, (err, doc) => {
                    if (err) return LogMessage('error', err);                            
                });
            }
        });*/

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
                        let lastOffline = doc.offline || 0;
                        let lastOnline = doc.online || 0;

                        if (lastOffline > lastOnline) {
                            message.channel.sendMessage([
                                                     `Member: ${doc.nickname}`,
                                                     `*Offline* seit **${moment(doc.offline).locale('de').toNow(true)}**`,                                                     
                                                    ].join('\r\n'));
                        } else {
                            message.channel.sendMessage([
                                                     `Member: ${doc.nickname}`,
                                                     `**Online** seit **${moment(doc.online).locale('de').toNow(true)}**`,                                                     
                                                    ].join('\r\n'));
                        }          
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
                            let lastOffline = doc.offline;
                            let lastOnline = doc.online;

                            if (lastOffline > lastOnline) {
                                message.channel.sendMessage([
                                                            `Member: ${doc.nickname}`,
                                                            `*Offline* seit **${moment(doc.offline).locale('de').toNow(true)}**`,                                                     
                                                        ].join('\r\n'));
                            } else {
                                message.channel.sendMessage([
                                                            `Member: ${doc.nickname}`,
                                                            `**Online** seit **${moment(doc.online).locale('de').toNow(true)}**`,                                                     
                                                        ].join('\r\n'));
                            }     
                        });                             
                    } else {
                        message.channel.sendMessage(`Ich habe keine Daten zu diesen/diesen Member(n).`);
                    }   
                });                           
            }            
        } else {
            message.channel.sendMessage('Bitte gib das Member an um das es geht. Entweder den Nickname, bzw Teile davon, oder die Snowflake.');
        }

        return true;
    };
}