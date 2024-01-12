const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 4000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbServer: process.env.DB_SERVER,
  dbDatabase: process.env.DB_DATABASE,
};
