import express from "express";
import { getUserById } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Only authenticated users can fetch user profiles
router.get("/:id", protect, getUserById);

export default router;
