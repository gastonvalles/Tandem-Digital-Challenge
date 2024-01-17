import jwt from "jsonwebtoken";
export const secret = process.env.JWT_SECRET;

export const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, secret, {
      ignoreExpiration: true,
      algorithms: ["HS256"],
    });

    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (payload.exp < currentTimestamp) {
      return res.status(401).json({
        message: "Token has expired",
      });
    }

    req.user = payload;
    next();
  } catch (error) {
    console.error("Token Verification Error:", error);
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
