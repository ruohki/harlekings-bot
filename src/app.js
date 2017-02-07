import WebServer from './webserver';
import Bot, { Command } from  './bot';

import { LogMessage } from './util';

LogMessage('info', 'Harlekings Discord Bot starten...');

// WebServer für Heroku Starten
let webserver = new WebServer();
webserver.Serve();

// Bot Initialisieren und Starten
let bot = new Bot();
bot.Init();