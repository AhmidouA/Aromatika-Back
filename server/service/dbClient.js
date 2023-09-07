const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
  })
// console.log(client);

pool.connect((err) => {
  if(err) throw new err
    console.log("Connect to PostgreSQL Successfully")
});


module.exports = pool;