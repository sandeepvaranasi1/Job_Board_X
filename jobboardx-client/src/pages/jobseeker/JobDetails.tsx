import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { Job } from "../../types/profile";
import { toast } from "react-toastify";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      console.error("Failed to fetch job", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      await api.post("/applications", { jobId: job?._id });
      toast.success("Application submitted successfully!");
      navigate("/applications");
    } catch (err) {
      console.error("Failed to apply", err);
      alert("Failed to apply.");
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!job) return <Typography>Job not found</Typography>;

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>
        {job.title}
      </Typography>
      <Box>
        <Typography
          variant="body1"
          sx={{ whiteSpace: "pre-line", fontFamily: "monospace" }}>
          {job.description}
        </Typography>
      </Box>

      <Typography mb={1}>
        <strong>Location:</strong> {job.location}
      </Typography>
      <Typography mb={3}>
        <strong>Salary:</strong> {job.salary}
      </Typography>

      <Button variant="contained" onClick={handleApply}>
        Apply Now
      </Button>
    </Box>
  );
};

export default JobDetails;
