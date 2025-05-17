import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  getProfileById,
} from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/me").get(protect, getMyProfile);
router.put("/", protect, updateMyProfile);
router.get("/:id", getProfileById);

export default router;
