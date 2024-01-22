// Importa módulos necesarios.
import { getConnection, closeConnection } from "../database/connection";
import mssql from "mssql";
import querys from "../database/querys";

// Middleware para verificar si un usuario ya existe en la base de datos.
export const userExist = async (req, res, next) => {
  let pool;
  try {
    // Obtiene una conexión a la base de datos.
    pool = await getConnection();
    const { usuario } = req.body;
    // Realiza una consulta para verificar la existencia del usuario.
    const userExist = await pool
      .request()
      .input("usuario", mssql.VarChar, usuario)
      .query(querys.loginUser);

    // Verifica si el usuario ya existe y responde en consecuencia.
    if (userExist.recordset.length > 0) {
      return res.status(400).json("Ya existe un usuario con este nombre");
    }
    // Llama al siguiente middleware.
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json("Error en la conexión a la base de datos");
  } finally {
    if (pool) {
      // Cierra la conexión a la base de datos.
      await closeConnection(pool);
    }
  }
};

// Middleware para verificar si un usuario ya existe al actualizar.
export const userUpdate = async (req, res, next) => {
  let pool;
  try {
    // Obtiene una conexión a la base de datos.
    pool = await getConnection();
    const { id } = req.params;
    const { usuario } = req.body;

    // Realiza una consulta para obtener el usuario actual.
    const userUpdate = await pool
      .request()
      .input("id", mssql.VarChar, id)
      .query(querys.getUserById);
    const newUser = userUpdate.recordset[0].usuario;

    // Verifica si el nombre de usuario se ha modificado y verifica su existencia.
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
    // Llama al siguiente middleware.
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json("Error en la conexión a la base de datos");
  } finally {
    if (pool) {
      // Cierra la conexión a la base de datos.
      await closeConnection(pool);
    }
  }
};
