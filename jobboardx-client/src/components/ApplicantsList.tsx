import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Button,
  Chip,
  Select,
  MenuItem,
} from "@mui/material";
import { getApplicantsForJob } from "../services/applicationService";
import { Job } from "../types/profile";
import { updateApplicantStatus } from "../services/applicationService";
import { getJobById } from "../services/jobService";

export interface Applicant {
  _id: string;
  applicant: {
    _id: string;
    fullName: string;
    email: string;
  };
  resumeLink?: string;
  status: "submitted" | "reviewed" | "accepted" | "rejected";
  createdAt: string;
}

const ApplicantsList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const [applicantsData, jobData] = await Promise.all([
            getApplicantsForJob(id),
            getJobById(id),
          ]);
          setApplicants(applicantsData);
          setJob(jobData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleStatusChange = async (
    applicantId: string,
    newStatus: Applicant["status"]
  ) => {
    try {
      await updateApplicantStatus(applicantId, newStatus);
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicantId ? { ...app, status: newStatus } : app
        )
      );
    } catch (error) {
      console.error("Failed to update application status:", error);
      alert("Failed to update application status. Please try again.");
    }
  };

  if (loading) return <CircularProgress />;
  if (!job) return <Typography>Job not found</Typography>;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Applicants for: {job.title}
      </Typography>

      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6">Job Summary</Typography>
        <Typography variant="body2">
          Job Description: {job.description}
        </Typography>
        <Typography variant="body2">Location: {job.location}</Typography>
        <Typography variant="body2">Salary: {job.salary}</Typography>
      </Paper>

      {applicants.length === 0 ? (
        <Typography>No applications yet</Typography>
      ) : (
        <List>
          {applicants.map((applicant) => (
            <React.Fragment key={applicant._id}>
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="h4" sx={{ textAlign: "center" }}>
                      {applicant.applicant.fullName}
                    </Typography>
                  }
                  secondary={
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "center",
                      }}>
                      <Typography variant="body2">
                        Email: {applicant.applicant.email}
                      </Typography>

                      <Chip
                        label={applicant.status}
                        color={
                          applicant.status === "accepted"
                            ? "success"
                            : applicant.status === "rejected"
                            ? "error"
                            : "default"
                        }
                        size="small"
                        sx={{ mt: 1 }}
                      />
                      {applicant.resumeLink && (
                        <Button
                          variant="outlined"
                          size="small"
                          href={applicant.resumeLink}
                          target="_blank"
                          rel="noopener">
                          View Resume
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        size="small"
                        href={`/profile/${applicant.applicant._id}`}
                        sx={{ mt: 1 }}>
                        View Profile
                      </Button>

                      <Select
                        value={applicant.status}
                        onChange={(e) =>
                          handleStatusChange(
                            applicant._id,
                            e.target.value as Applicant["status"]
                          )
                        }
                        size="small"
                        sx={{ mt: 1, textAlign: "center" }}>
                        <MenuItem value="submitted">Submitted</MenuItem>
                        <MenuItem value="reviewed">Reviewed</MenuItem>
                        <MenuItem value="accepted">Accepted</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                      </Select>
                    </Box>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ApplicantsList;
