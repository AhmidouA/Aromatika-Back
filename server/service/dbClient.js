const { Pool } = require('pg');
const Pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});
// console.log(client);
Pool.connect((err) => {
  if(err) throw err
    console.log("Connect to PostgreSQL Successfully")
});

module.exports = Pool;