import jwt from "jsonwebtoken";
export const secret = process.env.JWT_SECRET;

export const validateToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || token == "") {
    return res.status(401).json({
      message: "No Token",
    });
  }
  try {
    const payload = jwt.verify(token, secret);
    req.user = payload;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token has expired",
      });
    } else if (error.name === "JsonWebTokenError") {
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
