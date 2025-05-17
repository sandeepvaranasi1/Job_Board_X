import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Drawer,
  Toolbar,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AccountCircle } from "@mui/icons-material";

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const jobSeekerMenu = [
    { text: "Dashboard", path: "/" },
    { text: "Browse Jobs", path: "/jobs" },
    { text: "My Applications", path: "/applications" },
    { text: "My Profile", path: "/profile" },
  ];

  const employerMenu = [
    { text: "Dashboard", path: "/" },
    { text: "Manage Jobs", path: "/employer/jobs" },
    { text: "Post Job", path: "/employer/jobs/create" },
  ];

  const menu =
    user?.role === "employer"
      ? employerMenu
      : user?.role === "jobseeker"
      ? jobSeekerMenu
      : [];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 220,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 220, boxSizing: "border-box" },
      }}>
      <Toolbar />
      <Box sx={{ px: 2, py: 1 }}>
        <IconButton
          onClick={() => {
            user?.role === "jobseeker" && navigate("/profile");
          }}>
          <AccountCircle sx={{ fontSize: 32 }} />
        </IconButton>
        <Typography variant="subtitle1">
          {user?.fullName || "Guest"} {user?.role && `(${user.role})`}
        </Typography>
      </Box>
      <Divider />

      <List>
        {menu.map((item) => (
          <ListItem
            sx={{
              cursor: "pointer",
              ":hover": { color: "teal" },
            }}
            key={item.text}
            onClick={() => navigate(item.path)}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
