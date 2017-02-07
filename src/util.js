import moment from 'moment';

/**
 * Logger Methode die die Konsolenausgabe formatiert
 * @param  {String} level Das Logger Level zb. info, warn, error
 * @param  {String} message Die Logger Nachricht
 */
export const LogMessage = (level = 'info', message) => {
    let now = moment().format('DD.MM.YYYY-HH:mm:ss')
    console.log(`[${now}][${level}] ${message}`);
}