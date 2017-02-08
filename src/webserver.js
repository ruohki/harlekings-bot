import express from 'express';
import bodyParser from 'body-parser';

import mongoose from 'mongoose';
import validator from 'validator';

import moment from 'moment';
import 'moment/locale/de';

import { LogMessage } from './util.js';

const MemberInfo = mongoose.model('Memberinfo');

export default class WebServer {
    /**
     * Erstellt eine neue Instanz des Webservers
     * @constructor
     */
    constructor() {
        this.app = express();
        this.app.use(bodyParser.json());

        mongoose.connect(process.env.MONGO, {server:{auto_reconnect:true}});                        
        let Mongo = mongoose.connection;

        Mongo.on('error', error => LogMessage('error', error));
        Mongo.on('disconnected', () => mongoose.connect(process.env.MONGO, {server:{auto_reconnect:true}}));

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
        this.app.get('/', function (req, res) {
            res.json({ request: 'ok' });
        });

        this.app.get('/:user', (req, res) => {
            if (Mongo) {
                let pice = req.params.user;
                if (validator.isNumeric(pice)) {
                MemberInfo.findOne({
                    _id: pice
                }, (err, doc) => {
                    if (err) return LogMessage('error', err);
                    if (doc) {
                        let lastOffline = doc.offline || 0;
                        let lastOnline = doc.online || 0;

                        if (lastOffline > lastOnline) {
                            return res.json({result: {
                                member: doc.nickname,
                                offline: moment(doc.offline).locale('de').toNow(true)
                            }});                            
                        } else {
                            return res.json({result: {
                                member: doc.nickname,
                                online: moment(doc.online).locale('de').toNow(true)
                            }});
                        }          
                    } else {
                        return res.json({result: 'member nicht gefunden'})                            
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
                                let lastOffline = doc.offline;
                                let lastOnline = doc.online;

                                if (lastOffline > lastOnline) {
                                    object.push({
                                        member: doc.nickname,
                                        offline: moment(doc.offline).locale('de').toNow(true)
                                    });                                    
                                } else {
                                    object.push({
                                        member: doc.nickname,
                                        online: moment(doc.online).locale('de').toNow(true)
                                    });
                                }     
                            });
                            return res.json({result: object});                        
                        } else {
                            return res.json({result: 'member nicht gefunden'})   
                        }   
                    });                           
                }

            } else {
                return res.json({error: 'keine datenbankverbindung'});
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

            LogMessage('info', `WebServer gestartet: http://${host}:${port}`);            
        });
    }
}