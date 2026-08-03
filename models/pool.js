const { Pool } = require("pg");
const path = require("path");

require("process").loadEnvFile(path.join(__dirname, "../.env"));

module.exports = new Pool({
  host: process.env.HOST,
  user: process.env.USER,
  database: process.env.DB,
  password: process.env.PSWD,
  port: process.env.DB_PORT,
});
