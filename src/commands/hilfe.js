import Discord from 'discord.js';
import { Command } from '../bot';

import { LogMessage } from '../util.js';

var commandParameter = {
    Aliases: ['hilfe', 'help'],
    Help: `[<parameter>]`,
    
    name: 'bot_hilfe',
    description: '',
    author: 'Tillmann Hübner <ruohki@gmail.com>',

    version: {
        major: 0,
        minor: 1
    }
} 

export class Hilfe extends Command {   
    getParameter() {
        return {
            Aliases: ['hilfe', 'help'],
            Help: '<blank> oder [kommando]',
            SubCommands: {},

            name: 'hilfe',
            description: 'Liefert Allgemeine oder Kommandospezifische Hilfe',
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
        let pices = message.content.split(' ');
        if (pices.length > 1) {
            let sub = pices[1];

            this.Bot.commands.forEach( (val, key) => {
                let test = [];
                let info = val.getParameter();
                
                if ((info.Aliases.length) > 1 && !(info.hide)) {
                    if (info.Aliases.includes(sub)) {                    
                        test.push(`${info.Aliases[0]}\t${info.Help}`);
                        test.push(`\tAlias: ${info.Aliases.join(', ')}`);            
                        test.push(`\t${info.description}\r\n`);
                        
                        if (Object.keys(info.SubCommands).length > 0) {                
                            for(let subcmd in info.SubCommands){
                                subcmd
                                info.SubCommands[subcmd]
                                test.push(`\t[${subcmd}] ${info.SubCommands[subcmd]}`);
                            }                               
                        }
                                        
                        message.channel.sendMessage(`\`\`\`${test.join('\r\n')}\`\`\``);
                    }
                }
            });           
        } else if (pices.length === 1) {                
            let test = [];
            this.Bot.commands.forEach( (val, key) => {                                
                let info = val.getParameter();    
                if (info.Aliases.length > 1) {
                    test.push(`${info.Aliases[0]}\t${info.Help}`);
                    test.push(`\tAlias: ${info.Aliases.join(', ')}`);            
                    test.push(`\t${info.description}\r\n`);
                    
                    if (Object.keys(info.SubCommands).length > 0) {                
                        test.push(`\tsub: ${Object.keys(info.SubCommands).join(', ')}`)    
                    }                    
                }    
            });

            if (test.length > 0) message.channel.sendMessage(`\`\`\`${test.join('\r\n')}\`\`\``);            
        }
        return true;
    };
}