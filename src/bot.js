import fs from 'fs';
import { EventEmitter } from 'events';

import Discord from 'discord.js';

import { LogMessage } from './util';

export class Command {
    /**
     * @constructor
     * @param  {Bot} bot Bot Klasse
     * @param  {Client} client Discord.js Client
     */
    constructor(bot, client) {
        this.Bot = bot;
        this.Client = client;
    }

    /**
     * Alles was zum initialisieren des commands nötig ist
     * @returns {Boolean} Gibt true aus wenn der command erfolgreich initialisiert wurde
     */
    initialize = () => true;
    
    /**
     * Liefert informationen über dieses Kommando
     */
    getParameter() {
        return {
            Aliases: [],
            Help: '',
            
            name: '',
            description: '',
            author: '',

            version: {
                major: 0,
                minor: 0
            }
        }
    }

    
    /**
     * Wird aufgerufen sobald ein Kommando aufgerufen wird 
     * @param  {Discord.Message} message Discord JS Nachricht
     * @returns {Boolean} Gibt true zurück wenn der befehl verarbeitet wurde
     */
    executeCommand = ( message ) => false;

    
}


export default class Bot extends EventEmitter {
    
    /**
     * Erstellt eine Neue Instanz des Bots
     * @constructor
     */
    constructor() {
        super();
                
        this.Client = new Discord.Client();        
    }

    
    /**
     * Init Methode die den Bot verbindet und initalisiert
     */
    Init() {
        // Discord
        LogMessage('info', 'Melde Bot bei Discord an...');
        this.Client.on('ready', () => LogMessage('info', 'Bot erfolgreich bei Discord angemeldet!'));
        this.Client.login(process.env.TOKEN);
        
        // Kommandos Laden
        LogMessage('info', 'Lade Bot Module...');
        this.loadCommands().then( (commands) => {
            this.commands = commands
            return commands ? commands.size : 0;
        })
        .then( (num) => LogMessage('info', `${num} Modul(e) geladen.`) );

        this.Client.on('error', err => LogMessage('error', err));
        this.Client.on('disconnect', (e) => {
            LogMessage('error', `Closed: ${e.code }`);
            this.Client.login(process.env.TOKEN);
        });

        this.Client.on('message', message => {
            if (message.content.substr(0, 1) === '!') {
                let command = message.content.split(' ', 2)[0].substr(1).toLocaleLowerCase();

                let cmd = this.commands.get(command)
                this.commands.forEach( (val, key) => {
                    let info = val.getParameter();
                    if (info.Aliases.includes(command)) {
                        try {
                            val.executeCommand(message);
                        } catch (err) {
                            LogMessage('error', `(${command}) ${err}`);
                        }
                        
                    }
                });                                                                 
            }
        });   
    }

    /**
     * Läd alle Dateien aus dem Verzeichnis und versucht sie als Kommando zu instanzieren, wenn das
     * gelingt wird das modul dem rückgabewert hinzugefügt und somit dem Bot zur verfügung gestellt
     */
    loadCommands() {
        if (!this.Client) throw new Error('Client muss definiert sein');        

        return new Promise( (resolve, reject) => {
            let commands = new Map();
            fs.readdirSync(`${__dirname}/commands/`).map( (file) => {
                try {
                    let Module = require(`${__dirname}/commands/${file}`);                    

                    for ( let name in Module) {
                        try {
                            let command = new Module[name](this, this.Client);
                            let commandParams = command.getParameter();
                            
                            if (command.initialize()) {     
                                commands.set(commandParams.name, command);                                
                            }    
                        } catch (err) {
                            LogMessage('error', `(${name}): ${err}`);
                        }
                    }                    
                } catch (err) {
                    // Kein Gültiges Kommando Modul -> Skip
                    LogMessage('error', `(${file}) ${err}`);
                }                            
            });

            resolve(commands);
        });
    }
}