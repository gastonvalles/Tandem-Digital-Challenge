import { getConnection, closeConnection } from "../database/connection";
import mssql from "mssql";
import querys from "../database/querys";

export const userExist = async (req, res, next) => {
  let pool;
  try {
    pool = await getConnection();
    const { usuario } = req.body;
    const userExist = await pool
      .request()
      .input("usuario", mssql.VarChar, usuario)
      .query(querys.loginUser);

    if (userExist.recordset.length > 0) {
      return res.status(400).json("Ya existe un usuario con este nombre");
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json("Error en la conexión a la base de datos");
  } finally {
    if (pool) {
      await closeConnection(pool);
    }
  }
};

export const userUpdate = async (req, res, next) => {
  let pool;
  try {
    pool = await getConnection();
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
  } catch (error) {
    console.error(error);
    res.status(500).json("Error en la conexión a la base de datos");
  } finally {
    if (pool) {
      await closeConnection(pool);
    }
  }
};
