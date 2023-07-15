require('dotenv').config();
const { Pool } = require('pg');

const db = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.DBPORT
});

module.exports = db;

