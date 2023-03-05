// import des modules Winston et path
const { createLogger, transports, format } = require('winston');
const path = require('path');
// chemin vers le dossier logs
const logsDir = path.join(__dirname, '../logs'); 


// créer un logger pour enregistrer des journaux d'informations et d'erreurs
const customerLogger = createLogger({

    transports: [
            // logger d'erreur avec les info que j'ai besoin
        new transports.File({ 
            // dossier et ficher ou son logger les erreur
            filename: path.join(logsDir, 'customer-error.log'),
            // Niveau de journalisation (erreur)
            level: 'error',
            // Format personnalisé pour afficher les informations dans le journal
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.json(),
                format.printf(({ level, message, timestamp, url, method }) => {
                    return `Date:[${timestamp}] [${level.toUpperCase()}] Methode:[${method}] Routes:[${url}] ${message}`;
                })
                )
            })
        ]
    });

module.exports = {customerLogger}

