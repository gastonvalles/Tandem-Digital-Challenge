const mssql = require("mssql");
const config = require("../config");

const dbSetting = {
  user: config.dbUser,
  password: config.dbPassword,
  server: config.dbServer,
  database: config.dbDatabase,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function getConnection() {
  try {
    const pool = await mssql.connect(dbSetting);
    return pool;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getConnection, mssql };
