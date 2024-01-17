import jwt from "jsonwebtoken";
import { secret } from "../middlewares/validateToken";
import config from "../config";
import { invalidateToken } from "./usersController";

export const createRefreshToken = (req, res) => {
  try {
    const payload = {
      userId: req.user.userId,
    };

    const refreshToken = jwt.sign(payload, config.refreshTokenSecret, {
      algorithm: "HS256",
      expiresIn: config.refreshTokenExpiration,
    });

    res.status(201).json({ refreshToken });
  } catch (error) {
    console.error("Error creating refresh token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const refreshAccessToken = (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    if (invalidateToken(refreshToken)) {
      return res.status(401).json({ message: "Refresh token is invalidated" });
    }

    jwt.verify(refreshToken, config.refreshTokenSecret, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      const payload = {
        userId: user.userId,
      };

      const accessToken = jwt.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn: config.accessTokenExpiration,
      });

      res.status(200).json({ accessToken });
    });
  } catch (error) {
    console.error("Error refreshing access token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
