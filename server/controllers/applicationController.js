import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const applyToJob = async (req, res) => {
  const { jobId, resumeLink, coverLetter } = req.body;

  try {
    // Ensure job exists
    const jobExists = await Job.findById(jobId);
    if (!jobExists) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user already applied
    const existingApp = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existingApp) {
      return res
        .status(400)
        .json({ message: "You have already applied to this job." });
    }

    // Save new application
    const application = new Application({
      job: jobId,
      applicant: req.user._id,
      resumeLink,
      coverLetter,
    });

    const saved = await application.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Application error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/applications/me
export const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate({
        path: "job",
        match: {}, // allow filtering if needed later
        select: "title location salary", // avoid over-fetching
      })
      .sort({ createdAt: -1 });

    // Filter out applications with deleted jobs (job === null)
    const filteredApps = apps.filter((app) => app.job !== null);

    res.json(filteredApps);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getApplicantsForJob = async (req, res) => {
  try {
    const applicants = await Application.find({ job: req.params.id })
      .populate("applicant", "fullName email") // Populate applicant details
      .populate("job", "title location salary") // Populate job details
      .sort({ createdAt: -1 });

    res.json(applicants);
  } catch (err) {
    console.error("Error fetching applicants:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (app.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await app.deleteOne();
    res.json({ message: "Application withdrawn successfully" });
  } catch (err) {
    console.error("Error deleting application:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ["submitted", "reviewed", "accepted", "rejected"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    // Populate the `job.employer` field so we can check ownership
    const app = await Application.findById(req.params.id)
      .populate({
        path: "job",
        select: "employer", // bring in the employer ObjectId
      })
      .populate("applicant", "fullName email");

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (app.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    app.status = status;
    await app.save();

    res.json(app);
  } catch (err) {
    console.error("Error in updating application status:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
