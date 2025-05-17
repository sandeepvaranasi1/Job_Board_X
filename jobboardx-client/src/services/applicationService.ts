import api from "./api";
import { Application } from "../types/profile";
import { Applicant } from "../components/ApplicantsList";

interface ApplicationSubmitData { 
  jobId: string;
  resumeLink?: string;
  coverLetter?: string;
}

// Submit job application
export const submitApplication = async (
  data: ApplicationSubmitData
): Promise<Application> => {
  const res = await api.post("/applications", data);
  return res.data;
};

// Get my applications (for job seekers)
export const getMyApplications = async (): Promise<Application[]> => {
  const res = await api.get("/applications/me");
  return res.data;
};

// Get applicants for a job (for employers)

export const getApplicantsForJob = async (
  jobId: string
): Promise<Applicant[]> => {
  const res = await api.get(`/applications/job/${jobId}`);
  return res.data; // now backend sends full applicant populated
};

// Update applicant status
export const updateApplicantStatus = async (
  applicantId: string,
  status: string
) => {
  const res = await api.patch(`/applications/${applicantId}`, { status });
  return res.data;
};
