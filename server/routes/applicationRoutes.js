import express from "express";
import {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  deleteApplication,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("jobseeker"), applyToJob);
router.get("/me", protect, authorizeRoles("jobseeker"), getMyApplications);
router.get(
  "/job/:id",
  protect,
  authorizeRoles("employer"),
  getApplicantsForJob
);
router.delete("/:id", protect, authorizeRoles("jobseeker"), deleteApplication);

router.patch(
  "/:id",
  protect,
  authorizeRoles("employer"),
  updateApplicationStatus
); // For updating status

export default router;
