const { getConnection, mssql } = require("../database/conection");
const querys = require("../database/querys");

module.exports.userExist = async (req, res, next) => {
  const pool = await getConnection();
  const { usuario } = req.body;
  const userExist = await pool
    .request()
    .input("usuario", mssql.VarChar, usuario)
    .query(querys.loginUser);
  if (userExist.recordset.length > 0) {
    return res.status(400).json("Ya existe un usuario con este nombre");
  }
  next();
};

module.exports.userUpdate = async (req, res, next) => {
  const pool = await getConnection();
  const { id } = req.params;
  const { usuario } = req.body;
  const userUpdate = await pool
    .request()
    .input("id", mssql.VarChar, id)
    .query(querys.getUserById);
  const newUser = userUpdate.recordset[0].usuario;

  if (newUser !== usuario) {
    const userExist = await pool
      .request()
      .input("usuario", mssql.VarChar, usuario)
      .query(querys.loginUser);
    const actualUser = userExist.recordset[0];
    if (actualUser !== undefined) {
      return res.status(400).json("Ya existe un usuario con este nombre");
    }
  }
  next();
};
