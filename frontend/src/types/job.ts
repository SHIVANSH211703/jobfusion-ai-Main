export interface Job {
  _id: string;
  title: string;
  company: string;
  location?: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  skills?: string[];
  salary?: {
    min?: number | null;
    max?: number | null;
    currency?: string | null;
  };
  salaryMin?: number;
  salaryMax?: number;
  employmentType?: string;
  jobType?: string;
  experienceLevel?: string;
  experience?: string;
  remote?: boolean;
  isRemote?: boolean;
  source?: string;
  sourceUrl?: string;
  applyUrl?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
  postedAt?: string | null;
  isSaved?: boolean;
  hasApplied?: boolean;
}

export interface JobSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  remote?: boolean;
  minSalary?: number;
  maxSalary?: number;
  jobType?: string;
  days?: number;
}

export interface JobPageData {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface JobListResponse {
  success: boolean;
  message: string;
  data: JobPageData;
}

export interface JobResponse {
  success: boolean;
  message: string;
  data: Job;
}

export interface SaveJobResponse {
  success: boolean;
  message: string;
  data: unknown;
}

export interface SavedJobsResponse {
  success: boolean;
  message: string;
  data: JobPageData;
}

export interface JobApplication {
  _id: string;
  status: "applied" | "interview" | "offer" | "rejected" | "withdrawn";
  appliedAt: string;
  notes?: string;
  jobId?: Job;
  job?: Job;
  resumeId?: { _id: string; title?: string };
}

export interface ApplicationsResponse {
  success: boolean;
  message: string;
  data: {
    applications: JobApplication[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}