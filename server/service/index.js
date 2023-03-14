const dbClient = require("./dbClient");
const auth = require("./auth");
const mail = require("./mail");

module.exports = {
  dbClient, // équivalent à "dbClient : dbClient"
  auth, // middleware authentification
  mail, // module nodemailer
};
