import express from "express";
import { validateToken } from "../middlewares/validateToken";
import {
  createRefreshToken,
  refreshAccessToken,
} from "../controllers/refreshTokenController";

const router = express.Router();

router.post("/refresh-token", validateToken, createRefreshToken);
router.post("/refresh-access-token", refreshAccessToken);

export default router;
