'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Command = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _events = require('events');

var _discord = require('discord.js');

var _discord2 = _interopRequireDefault(_discord);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Command {
    /**
     * @constructor
     * @param  {Bot} bot Bot Klasse
     * @param  {Client} client Discord.js Client
     */
    constructor(bot, client) {
        this.initialize = () => true;

        this.executeCommand = message => false;

        this.Bot = bot;
        this.Client = client;
    }

    /**
     * Alles was zum initialisieren des commands nötig ist
     * @returns {Boolean} Gibt true aus wenn der command erfolgreich initialisiert wurde
     */


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
        };
    }

    /**
     * Wird aufgerufen sobald ein Kommando aufgerufen wird 
     * @param  {Discord.Message} message Discord JS Nachricht
     * @returns {Boolean} Gibt true zurück wenn der befehl verarbeitet wurde
     */
}

exports.Command = Command;
class Bot extends _events.EventEmitter {

    /**
     * Erstellt eine Neue Instanz des Bots
     * @constructor
     */
    constructor() {
        super();

        this.Client = new _discord2.default.Client();
    }

    /**
     * Init Methode die den Bot verbindet und initalisiert
     */
    Init() {
        // Discord
        (0, _util.LogMessage)('info', 'Melde Bot bei Discord an...');
        this.Client.on('ready', () => (0, _util.LogMessage)('info', 'Bot erfolgreich bei Discord angemeldet!'));
        this.Client.login(process.env.TOKEN);

        // Kommandos Laden
        (0, _util.LogMessage)('info', 'Lade Bot Module...');
        this.loadCommands().then(commands => {
            this.commands = commands;
            return commands ? commands.size : 0;
        }).then(num => (0, _util.LogMessage)('info', `${num} Modul(e) geladen.`));

        this.Client.on('error', err => (0, _util.LogMessage)('error', err));
        this.Client.on('disconnect', e => {
            (0, _util.LogMessage)('error', `Closed: ${e.code}`);
            process.exit();
        });

        this.Client.on('message', message => {
            if (message.content.substr(0, 1) === '!') {
                let command = message.content.split(' ', 2)[0].substr(1).toLocaleLowerCase();

                let cmd = this.commands.get(command);
                this.commands.forEach((val, key) => {
                    let info = val.getParameter();
                    if (info.Aliases.includes(command)) {
                        try {
                            val.executeCommand(message);
                        } catch (err) {
                            (0, _util.LogMessage)('error', `(${command}) ${err}`);
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

        return new Promise((resolve, reject) => {
            let commands = new Map();
            _fs2.default.readdirSync(`${__dirname}/commands/`).map(file => {
                try {
                    let Module = require(`${__dirname}/commands/${file}`);

                    for (let name in Module) {
                        try {
                            let command = new Module[name](this, this.Client);
                            let commandParams = command.getParameter();

                            if (command.initialize()) {
                                commands.set(commandParams.name, command);
                            }
                        } catch (err) {
                            (0, _util.LogMessage)('error', `(${name}): ${err}`);
                        }
                    }
                } catch (err) {
                    // Kein Gültiges Kommando Modul -> Skip
                    (0, _util.LogMessage)('error', `(${file}) ${err}`);
                }
            });

            resolve(commands);
        });
    }
}
exports.default = Bot;