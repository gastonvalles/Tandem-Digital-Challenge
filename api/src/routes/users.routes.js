import express from "express";
import { body, validationResult } from "express-validator";
import { userExist, userUpdate } from "../middlewares/userExist";
import { validateToken } from "../middlewares/validateToken";
import {
  getUsers,
  createUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  login,
  logout,
  refreshAccessToken,
} from "../controllers/usersController";

// Crea un router de express.
const router = express.Router();

// Ruta para iniciar sesión.
router.post("/login", login);
// Ruta para cerrar sesión.
router.post("/logout", validateToken, logout);
// Ruta para obtener un nuevo token de acceso.
router.post("/refresh-token", refreshAccessToken);

// Ruta para ver todos los usuarios
router.get("/users", validateToken, getUsers);
// Ruta para obtener un usuario por ID.
router.get("/users/:id", validateToken, getUserById);

// Ruta para crear usuarios con validación de datos utilizando express-validator.
router.post(
  "/users",
  [
    body("nombre").isString(),
    body("apellido").isString(),
    body("email").isEmail(),
    body("telefono").isMobilePhone("any"),
    body("usuario").isString(),
    body("contraseña").isString(),
  ],
  userExist,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  createUsers
);

// Ruta para actualizar usuarios con validación de datos y verificación de existencia de usuario.
router.put(
  "/users/:id",
  [
    body("nombre").isString().optional({ nullable: true }),
    body("apellido").isString().optional({ nullable: true }),
    body("email").isEmail().optional({ nullable: true }),
    body("telefono").isMobilePhone("any").optional({ nullable: true }),
    body("usuario").isString().optional({ nullable: true }),
    body("contraseña").isString().optional({ nullable: true }),
  ],
  validateToken,
  userUpdate,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  updateUserById
);

// Ruta para eliminar un usuario por ID.
router.delete("/users/:id", validateToken, deleteUserById);

// Exporta el router para ser utilizado en otros archivos.
export default router;
