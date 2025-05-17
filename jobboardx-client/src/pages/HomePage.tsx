import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Work, Assignment, Person, Business } from "@mui/icons-material";

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box>
      {user && (
        <Box>
          {user && user.role === "jobseeker" ? (
            <Container maxWidth="md" sx={{ mb: 5 }}>
              <Box mt={5} textAlign="center">
                <Typography variant="h4" gutterBottom>
                  Welcome, {user?.fullName} ({user?.role}) 💼
                </Typography>
                <Typography variant="subtitle1">
                  Browse and apply for jobs that match your skills and
                  interests.
                </Typography>
              </Box>
            </Container>
          ) : (
            <Container maxWidth="md" sx={{ mb: 5 }}>
              <Box mt={5} textAlign="center">
                <Typography variant="h4" gutterBottom>
                  Welcome, {user?.fullName} ({user?.role}) 👔
                </Typography>
                <Typography variant="subtitle1">
                  Here you can manage your job postings, view applicants, and
                  more.
                </Typography>
              </Box>
            </Container>
          )}
        </Box>
      )}
      {/* Hero Section */}
      <Paper
        sx={{
          py: 8,
          px: 2,
          mb: 6,
          textAlign: "center",
          backgroundImage:
            "linear-gradient(to bottom,rgb(43, 0, 173),rgb(246, 200, 100))",
          color: "white",
        }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom>
            Find Your Dream Job with JobBoardX
          </Typography>
          <Typography variant="h6">
            Connect with top employers and find the perfect opportunity for your
            career
          </Typography>

          {!user ? (
            <Box sx={{ mt: 4 }}>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="secondary"
                size="large"
                sx={{ mx: 1 }}>
                Sign Up Now
              </Button>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                sx={{ mx: 1, bgcolor: "rgba(255,255,255,0.1)" }}
                size="large">
                Login
              </Button>
            </Box>
          ) : (
            <Button
              component={RouterLink}
              to={user.role === "jobseeker" ? "/jobs" : "/employer/jobs"}
              variant="contained"
              color="primary"
              sx={{ mt: 4 }}
              size="large">
              {user.role === "jobseeker" ? "Browse Jobs" : "Manage Your Jobs"}
            </Button>
          )}
        </Container>
      </Paper>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          How JobBoardX Works
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <CardContent>
                <Work sx={{ fontSize: 50, color: "primary.main" }} />
                <Typography variant="h6" gutterBottom>
                  Browse Jobs
                </Typography>
                <Typography variant="body2">
                  Explore thousands of job listings across various industries
                  and locations.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <CardContent>
                <Assignment sx={{ fontSize: 50, color: "primary.main" }} />
                <Typography variant="h6" gutterBottom>
                  Apply Easily
                </Typography>
                <Typography variant="body2">
                  Submit your applications seamlessly through our simple
                  platform.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <CardContent>
                <Person sx={{ fontSize: 50, color: "primary.main" }} />
                <Typography variant="h6" gutterBottom>
                  Manage Applications
                </Typography>
                <Typography variant="body2">
                  Keep track of your job applications and interview schedules
                  easily.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <CardContent>
                <Business sx={{ fontSize: 50, color: "primary.main" }} />
                <Typography variant="h6" gutterBottom>
                  Employers Connect
                </Typography>
                <Typography variant="body2">
                  Employers can post jobs, manage applicants, and find the right
                  talent.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          textAlign: "center",
          py: 4,
          mt: 6,
          bgcolor: "primary.main",
          color: "#f5f5f5",
        }}>
        <Typography variant="body2" color="inherit">
          © {new Date().getFullYear()} JobBoardX. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
