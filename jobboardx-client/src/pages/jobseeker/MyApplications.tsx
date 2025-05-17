import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";
import { Application } from "../../types/profile";

const MyApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications/me");
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmWithdraw = (id: string) => {
    setSelectedAppId(id);
    setOpenDialog(true);
  };

  const handleWithdraw = async () => {
    if (!selectedAppId) return;
    try {
      await api.delete(`/applications/${selectedAppId}`);
      setApplications((prev) =>
        prev.filter((app) => app._id !== selectedAppId)
      );
      toast.success("Application withdrawn successfully");
    } catch (err) {
      console.error("Failed to withdraw application", err);
      toast.error("Failed to withdraw application");
    } finally {
      setOpenDialog(false);
      setSelectedAppId(null);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading)
    return <CircularProgress sx={{ mx: "auto", mt: 4, display: "block" }} />;

  return (
    <Box p={4}>
      <Typography variant="h4" mb={4}>
        My Applications
      </Typography>

      {applications.length === 0 ? (
        <Typography>You have not applied to any jobs yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {applications
            .filter((app) => app.job !== null)
            .map((app) => (
              <Grid key={app._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{app.job?.title}</Typography>
                    <Typography>{app.job?.location}</Typography>
                    <Typography>{app.job?.salary}</Typography>
                    <Chip
                      label={app.status}
                      size="small"
                      sx={{ mt: 1, textTransform: "capitalize" }}
                      color={
                        app.status === "accepted"
                          ? "success"
                          : app.status === "rejected"
                          ? "error"
                          : app.status === "reviewed"
                          ? "info"
                          : "default"
                      }
                    />
                  </CardContent>
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    sx={{ p: 2 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => confirmWithdraw(app._id)}>
                      Withdraw
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="confirm-dialog-title">
        <DialogTitle id="confirm-dialog-title">
          Withdraw Application?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to withdraw this application? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleWithdraw} color="error" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyApplications;
