import express from "express";
import {
  createJob,
  getMyJobs,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("employer"), createJob); // Create a job
router.get("/my-jobs", protect, authorizeRoles("employer"), getMyJobs); // Employer: get own jobs
router.get("/", getAllJobs); // Everyone: list all jobs
router.get("/:id", getJobById); // View job detail
router.put("/:id", protect, authorizeRoles("employer"), updateJob); // Update job
router.delete("/:id", protect, authorizeRoles("employer"), deleteJob); // Delete own job

export default router;
