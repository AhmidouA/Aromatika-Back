const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});
// console.log(client);
client.connect();

module.exports = client;