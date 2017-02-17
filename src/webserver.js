import express from 'express';
import bodyParser from 'body-parser';

import mongoose from 'mongoose';
import validator from 'validator';

import moment from 'moment';
import 'moment/locale/de';

import { LogMessage } from './util.js';

import  { MemberInfo }  from './models.js';

export default class WebServer {
    /**
     * Erstellt eine neue Instanz des Webservers
     * @constructor
     */
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());


        this.setupRoutes();
    }

    /**
     * Legt die Routen des Webservers fest
     */
    setupRoutes() {
        // Error Handling
        if (!this.app) throw new Error('WebServer nicht Initialisiert');

        // Man könnte hier jetzt jede menge module usw einbinden da der webserver aber nur für 
        // Heroku existiert halten wir es simpel

        this.app.get('/query', (req, res) => {
            let pice = req.query.user;
            if (validator.isNumeric(pice)) {
                MemberInfo.findOne({
                    _id: pice
                }, (err, doc) => {
                    if (err) return LogMessage('error', err);
                    if (doc) {   
                        
                        let games = []
                        if (doc.games) {
                            Object.keys(doc.games).map( (key, i) => {
                                games.push({name: key, lastActive: moment(doc.games[key]).locale('de').format('DD. MMMM YYYY [um] HH:mm:ss')});                                
                            })
                        }

                        message.channel.sendMessage(lines.join('\r\n'));                     
                        return res.json({success: true, result: [{
                            member: doc.nickname,
                            lastActive: moment(doc.lastActive).locale('de').format('DD. MMMM YYYY [um] HH:mm:ss'),
                            games
                        }]});                                                        
                    } else {
                        return res.json({success: false, result: 'member nicht gefunden'})                            
                    }                    
                }); 
            } else {
                MemberInfo.find({
                    nickname: {'$regex': new RegExp(pice, "i")}
                }, (err, docs) => {
                    if (err) return LogMessage('error', err);
                    if (docs.length > 0) {
                        let object = []
                        docs.map( (doc) => {                           
                            object.push({
                                member: doc.nickname,
                                lastActive: moment(doc.lastActive).locale('de').format('DD. MMMM YYYY [um] HH:mm:ss')
                            });                                                                 
                        });
                        return res.json({success: true, result: object});                        
                    } else {
                        return res.json({success: false, result: 'member nicht gefunden'})   
                    }   
                });                           
            }
        })
    }

    /**
     * Startet den WebServer
     */
    Serve() {
        this.server = this.app.listen(process.env.PORT || 3000, "0.0.0.0", () => {
            const host = this.server.address().address;
            const port = this.server.address().port;
            
            this.app.use(express.static('../web_root/'));

            LogMessage('info', `WebServer gestartet: http://${host}:${port}`);            
        });
    }
}