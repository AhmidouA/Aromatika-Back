const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});
// console.log(client);
Client.connect((err) => {
  if(err) throw new err
    console.log("Connect to PostgreSQL Successfully")
});

module.exports = client;