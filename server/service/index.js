const dbClient = require("./dbClient");
const auth = require("./auth");
const security = require("./security");

module.exports = {
  dbClient, // équivalent à "dbClient : dbClient"
  auth, // middleware authentification
  security
};
