const express = require("express");
const { body, validationResult } = require("express-validator");

const usersController = require("../controllers/usersController");
const { userExist, userUpdate } = require("../middlewares/userExist");
const { validateToken } = require("../middlewares/validateToken");

const getUsers = usersController.getUsers;
const createUsers = usersController.createUsers;
const getUserById = usersController.getUserById;
const deleteUserById = usersController.deleteUserById;
const updateUserById = usersController.updateUserById;
const login = usersController.login;
const logout = usersController.logout;

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

module.exports = router;
