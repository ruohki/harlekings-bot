import Discord from 'discord.js';
import request from 'request';

import { Command } from '../bot';

import { LogMessage } from '../util.js';

export class KickGuests extends Command {  
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
        } 
    }

    initialize = () => {
        this.Client.on('presenceUpdate', ( oldUser, newUser) => {            
            if ((newUser.presence.status === "offline") && (newUser.roles.size <= 1)) {            
                newUser.sendMessage('Du wirst vom HarleKings Discord *entfernt*. Grund: Gäste dürfen bei uns **NICHT** idlen, unsichtbar oder offline sein. Stelle deinen Status auf **online** und verbinde dich erneut über https://discordapp.com/invite/VmcUg5m .');                
                setTimeout( () => newUser.kick(), 1000);                
            }
        });

        return true;
    }
}
