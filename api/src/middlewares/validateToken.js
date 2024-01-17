import jwt from "jsonwebtoken";
export const secret = process.env.JWT_SECRET;
export const refreshSecret = process.env.REFRESH_TOKEN_SECRET;

export const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  try {
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const secretToUse = token.includes("refresh") ? refreshSecret : secret;

    const payload = jwt.verify(token, secretToUse, { algorithms: ["HS256"] });
    req.user = payload;
    next();
  } catch (error) {
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
