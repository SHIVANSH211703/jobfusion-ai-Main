export interface DashboardStatCounts {
  applications: number;
  savedJobs: number;
  interviews: number;
  profileCompletion: number;
  resumes: number;
  atsScore: number | null;
  resumeScore: number | null;
}

export interface DashboardResume {
  _id: string;
  title: string;
  status?: string;
  isDefault?: boolean;
  isPublic?: boolean;
  atsScore: number | null;
  aiSummary?: string;
  atsAnalysis?: {
    strengths?: string[];
    weaknesses?: string[];
    recommendations?: string[];
    analyzedAt?: string | null;
  };
  personalInfo?: Record<string, unknown>;
  summary?: string;
  skills?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardJobSummary {
  _id: string;
  title: string;
  company: string;
  location?: string;
  jobType?: string;
  salary?: {
    min?: number | null;
    max?: number | null;
    currency?: string | null;
  } | null;
  postedAt?: string | null;
  applyUrl?: string | null;
  isRemote?: boolean;
  description?: string;
  skills?: string[];
  source?: string;
}

export interface DashboardApplicationSummary {
  _id: string;
  status: string;
  appliedAt?: string;
  notes?: string;
  jobId?: Record<string, unknown> | null;
  resumeId?: Record<string, unknown> | null;
}

export interface DashboardSavedJobSummary {
  _id: string;
  jobId?: Record<string, unknown> | null;
  createdAt?: string;
}

export interface DashboardUserSummary {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  headline?: string;
  location?: string;
  experienceLevel?: string;
  skills?: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface DashboardData {
  stats: DashboardStatCounts;
  recentApplications: DashboardApplicationSummary[];
  savedJobs: DashboardSavedJobSummary[];
  recommendedJobs: DashboardJobSummary[];
  latestResume: DashboardResume | null;
  user: DashboardUserSummary | null;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}
