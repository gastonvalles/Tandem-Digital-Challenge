import jwt from "jsonwebtoken";
export const secret = process.env.JWT_SECRET;

export const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  try {
    console.log("Verifying Token:", token);
    const payload = jwt.verify(token, secret, { algorithms: ["HS256"] });
    console.log("Token verificado. Payload:", payload);
    req.user = payload;
    next();
  } catch (error) {
    console.error("Token Verification Error:", error);
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
