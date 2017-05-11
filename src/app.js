import WebServer from './webserver';
import Bot, { Command } from  './bot';

import mongoose from 'mongoose';

import { LogMessage } from './util';

LogMessage('info', 'Harlekings Discord Bot starten...');



mongoose.connect(process.env.MONGO, {server:{auto_reconnect:true}});                        

let Mongo = mongoose.connection;
Mongo.on('error', error => LogMessage('error', error));
Mongo.on('disconnected', () => mongoose.connect(process.env.MONGO, {server:{auto_reconnect:true}}));

// Bot Initialisieren und Starten
let bot = new Bot();
bot.Init();

// WebServer für Heroku Starten
let webserver = new WebServer(bot);
webserver.Serve();

