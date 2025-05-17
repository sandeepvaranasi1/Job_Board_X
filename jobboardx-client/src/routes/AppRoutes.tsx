import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";

import RoleBasedRoute from "./RoleBasedRoute";
import ProfilePage from "../pages/ProfilePage";
import PublicProfilePage from "../pages/PublicProfilePage";
import ManageJobs from "../pages/employer/ManageJobs";
import CreateJob from "../pages/employer/CreateJob";
import EditJob from "../pages/employer/EditJob";
import BrowseJobs from "../pages/jobseeker/BrowseJobs";
import JobDetails from "../pages/jobseeker/JobDetails";
import MyApplications from "../pages/jobseeker/MyApplications";
import ApplicantsList from "../components/ApplicantsList";
import HomePage from "../pages/HomePage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile/:id" element={<PublicProfilePage />} />

      {/* Role Protected Routes */}
      <Route element={<RoleBasedRoute allowedRoles={["jobseeker"]} />}>
        <Route path="/jobs" element={<BrowseJobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/applications" element={<MyApplications />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route element={<RoleBasedRoute allowedRoles={["employer"]} />}>
        <Route path="/employer/jobs" element={<ManageJobs />} />
        <Route path="/employer/jobs/create" element={<CreateJob />} />
        <Route path="/employer/jobs/edit/:id" element={<EditJob />} />
        <Route path="/applicants/:id" element={<ApplicantsList />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};

export default AppRoutes;
