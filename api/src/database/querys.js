module.exports = {
  getAllUsers: "SELECT * FROM Users",
  createNewUser:
    "INSERT INTO Users (nombre, apellido, email, telefono, usuario, contraseña) VALUES (@nombre, @apellido, @email, @telefono, @usuario, @contraseña)",
  getUserById: "SELECT * FROM Users where id = @id",
  deleteUserById: "DELETE FROM Users WHERE id = @id",
  updateUserById:
    "UPDATE Users SET nombre = @nombre, apellido = @apellido, email = @email, telefono = @telefono, usuario = @usuario, contraseña = @contraseña WHERE Id = @Id",
  loginUser: "SELECT * FROM Users WHERE usuario = @usuario",
};
