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

const router = express.Router();

router.get("/users", validateToken, getUsers);

router.post("/login", login);

router.post("/logout", validateToken, logout, (req, res) => {
  res.redirect("/login");
});

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
  validateToken,
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

router.get("/users/:id", validateToken, getUserById);

router.delete("/users/:id", validateToken, deleteUserById);

router.put(
  "/users/:id",
  validateToken,
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

router.post("/refresh-token", refreshAccessToken);

export default router;
