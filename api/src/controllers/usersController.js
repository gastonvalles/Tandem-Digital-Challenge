import { getConnection, closeConnection } from "../database/connection";
import querys from "../database/querys";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mssql from "mssql";
import { secret } from "../middlewares/validateToken";

const invalidatedTokens = [];

export const invalidateToken = (token) => {
  invalidatedTokens.push(token);
};

export default {
  invalidatedTokens,
  invalidateToken,
};

export const getUsers = async (req, res) => {
  let pool;
  try {
    pool = await getConnection();
    const result = await pool.request().query(querys.getAllUsers);
    for (let i = 0; i < result.recordset.length; i++) {
      result.recordset[i].contraseña = "";
    }
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send("Error:", error.message);
  } finally {
    await closeConnection(pool);
  }
};

export const login = async (req, res) => {
  const { usuario, contraseña } = req.body;
  let pool;
  try {
    pool = await getConnection();
    const result = await pool
      .request()
      .input("usuario", mssql.VarChar, usuario)
      .query(querys.loginUser);
    const user = result.recordset[0];

    if (!user) {
      return res.status(400).json({ message: "No se encontró el usuario" });
    }

    const passwordMatch = await bcrypt.compare(contraseña, user.contraseña);
    if (passwordMatch) {
      const payload = {
        userId: user.id,
      };

      const token = jwt.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn: "1h",
      });

      res.status(201).json({ message: "Acceso conseguido", token });
    } else {
      res.status(401).json({ message: "Usuario o contraseña incorrecta" });
    }
  } catch (error) {
    console.error("Error en la función login:", error);
    res.status(500).send(error.message);
  } finally {
    await closeConnection(pool);
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    invalidateToken(token);
    res.status(200).json({ message: "Sesión cerrada exitosamente" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const createUsers = async (req, res) => {
  const { nombre, apellido, email, telefono, usuario, contraseña } = req.body;
  if (!nombre || !apellido || !email || !telefono || !usuario || !contraseña) {
    return res.status(400).json({ msg: "Por favor llene todos los campos" });
  }
  let pool;
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);
    pool = await getConnection();
    await pool
      .request()
      .input("nombre", mssql.VarChar, nombre)
      .input("apellido", mssql.VarChar, apellido)
      .input("email", mssql.VarChar, email)
      .input("telefono", mssql.VarChar, telefono)
      .input("usuario", mssql.VarChar, usuario)
      .input("contraseña", mssql.VarChar, hashedPassword)
      .query(querys.createNewUser);
    res.json({ nombre, apellido, email, telefono, usuario });
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    await closeConnection(pool);
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  let pool;
  try {
    pool = await getConnection();
    const result = await pool
      .request()
      .input("id", id)
      .query(querys.getUserById);
    res.send(result.recordset[0]);
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    await closeConnection(pool);
  }
};

export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  let pool;
  try {
    pool = await getConnection();
    await pool.request().input("id", id).query(querys.deleteUserById);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    await closeConnection(pool);
  }
};

export const updateUserById = async (req, res) => {
  const { nombre, apellido, email, telefono, usuario, contraseña, id } =
    req.body;
  let pool;
  try {
    pool = await getConnection();
    const result = await pool
      .request()
      .input("id", mssql.Int, id)
      .query(querys.getUserById);
    const user = result.recordset[0];

    if (contraseña.length > 0) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(contraseña, saltRounds);
      await pool
        .request()
        .input("nombre", mssql.VarChar, nombre)
        .input("apellido", mssql.VarChar, apellido)
        .input("email", mssql.VarChar, email)
        .input("telefono", mssql.VarChar, telefono)
        .input("usuario", mssql.VarChar, usuario)
        .input("contraseña", mssql.VarChar, hashedPassword)
        .input("id", mssql.Int, id)
        .query(querys.updateUserById);

      res.json({ nombre, apellido, email, telefono, usuario });
    } else {
      await pool
        .request()
        .input("nombre", mssql.VarChar, nombre)
        .input("apellido", mssql.VarChar, apellido)
        .input("email", mssql.VarChar, email)
        .input("telefono", mssql.VarChar, telefono)
        .input("usuario", mssql.VarChar, usuario)
        .input("contraseña", mssql.VarChar, user.contraseña)
        .input("id", mssql.Int, id)
        .query(querys.updateUserById);

      res.json({ nombre, apellido, email, telefono, usuario });
    }
  } catch (error) {
    res.status(500).send(error.message);
  } finally {
    await closeConnection(pool);
  }
};
