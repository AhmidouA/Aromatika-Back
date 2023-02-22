const dbClient = require("./dbClient");
const auth = require('./auth');



module.exports = {
    dbClient, // équivalent à "dbClient : dbClient"
    auth // middleware authentification
};