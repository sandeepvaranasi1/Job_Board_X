export interface Profile {
  _id?: string;
  fullName: string;
  bio: string;
  skills: string[];
  experience: string;
  resumeLink: string;
}

export interface Job {
  _id: string;
  title: string;
  description: string;
  skills: string[];
  location: string;
  salary: string | number;
  employer:
    | string
    | {
        _id: string;
        fullName: string;
        email: string;
      };
  createdAt?: string;
}

export interface Application {
  _id: string;
  job: Job;
  applicant: string;
  resumeLink?: string;
  status: "submitted" | "reviewed" | "accepted" | "rejected";
  createdAt?: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "jobseeker" | "employer";
  bio?: string;
  skills?: string[];
  experience?: string;
  resumeLink?: string;
}
