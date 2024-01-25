// Importa módulo necesario.
import jwt from "jsonwebtoken";

// Configura las claves secretas.
export const secret = process.env.JWT_SECRET;
export const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

// Middleware para validar tokens.
export const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  try {
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    // Determina qué secreto utilizar según el tipo de token.
    const secretToUse = token.includes("refresh") ? refreshSecret : secret;

    // Verifica y decodifica el token.
    const payload = jwt.verify(token, secretToUse, { algorithms: ["HS256"] });

    // Almacena la información del usuario en la solicitud.
    req.user = payload;
    // Llama al siguiente middleware.
    return next();
  } catch (error) {
    // Manejo de errores según el tipo de error.
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token",
      });
    } else {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
  }
};
