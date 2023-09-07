const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
  })
// console.log(client);


module.exports = pool;