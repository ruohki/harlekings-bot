import express from 'express';
import bodyParser from 'body-parser';

import { LogMessage } from './util';

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
        this.app.get('/', function (req, res) {
            res.json({ request: 'ok' });
        });
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