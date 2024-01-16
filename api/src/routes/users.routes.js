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
} from "../controllers/usersController";

const router = express.Router();

router.get("/users", [validateToken], getUsers);

router.post("/login", login);

router.post("/logout", logout, (req, res) => {
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
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      return next();
    },
    userExist,
  ],
  createUsers
);

router.get("/users/:id", getUserById);

router.delete("/users/:id", deleteUserById);

router.put(
  "/users/:id",
  [
    body("nombre").isString().optional({ nullable: true }),
    body("apellido").isString().optional({ nullable: true }),
    body("email").isEmail().optional({ nullable: true }),
    body("telefono").isMobilePhone("any").optional({ nullable: true }),
    body("usuario").isString().optional({ nullable: true }),
    body("contraseña").isString().optional({ nullable: true }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      return next();
    },
    userUpdate,
  ],
  updateUserById
);

export default router;
