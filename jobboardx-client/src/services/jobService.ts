import { Job } from "../types/profile";
import api from "./api";

export interface JobData {
  title: string;
  description: string;
  skills: string[];
  location: string;
  salary: number;
}

export const createJob = (jobData: JobData) => api.post("/jobs", jobData);

export const getMyJobs = () => api.get("/jobs/my");

export const getAllJobs = () => api.get("/jobs");

export const getJobById = async (id: string): Promise<Job> => {
  const res = await api.get(`/jobs/${id}`);
  return res.data;
};

export const deleteJob = (id: string) => api.delete(`/jobs/${id}`);
