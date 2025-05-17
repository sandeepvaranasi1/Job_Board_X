import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Job } from "../../types/profile";

const BrowseJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchJobs = async () => {
    try {
      const res = await api.get(`/jobs?search=${search}`);
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search]);

  if (loading) return <CircularProgress />;

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>
        Browse Jobs
      </Typography>

      <TextField
        fullWidth
        placeholder="Search by title, location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
      />

      {jobs.length === 0 ? (
        <Typography>No jobs found.</Typography>
      ) : (
        <Grid container spacing={2}>
          {jobs.map((job) => (
            <Grid key={job._id}>
              <Card sx={{ display: "flex", flexDirection: "column", p: 2 }}>
                <CardContent>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography>{job.location}</Typography>
                  <Typography>{job.salary}</Typography>
                </CardContent>
                <Button onClick={() => navigate(`/jobs/${job._id}`)}>
                  View Details
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default BrowseJobs;
