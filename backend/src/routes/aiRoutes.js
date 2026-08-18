import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { reviewCode } from "../controllers/aiController.js";

const router = express.Router();

router.post("/review", protectRoute, reviewCode);

export default router;
