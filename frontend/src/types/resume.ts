export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  grade?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Experience {
  company: string;
  position: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  description?: string;
}

export interface Project {
  title: string;
  description?: string;
  technologies: string[];
  github?: string;
  liveDemo?: string;
}

export interface Certification {
  name: string;
  issuer?: string;
  issueDate?: string;
}

export interface Achievement {
  title: string;
  description?: string;
}

export interface Language {
  name: string;
  proficiency?: string;
}

export interface Resume {
  _id?: string;
  id?: string;

  title: string;
  template: string;

  status: string;

  isDefault: boolean;
  isPublic: boolean;
  publicSlug: string;

  atsScore: number;
  aiSummary: string;
  atsAnalysis?: ATSAnalysisResponse["data"];

  personalInfo: PersonalInfo;

  summary: string;

  education: Education[];
  experience: Experience[];
  projects: Project[];

  skills: string[];

  certifications: Certification[];
  achievements: Achievement[];
  languages: Language[];

  customSections?: unknown[];

  fileUrl?: string | null;
  fileType?: string | null;
  originalName?: string | null;
  hasFile?: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface ResumeResponse {
  success: boolean;
  message: string;
  data: Resume;
}

export interface ResumeListResponse {
  success: boolean;
  message: string;
  data: Resume[];
}

export interface ATSAnalysisResponse {
  success: boolean;
  message: string;
  data: {
    score: number;
    aiSummary: string;
    categories: {
      keywords: number;
      skills: number;
      experience: number;
      education: number;
      formatting: number;
      impact: number;
    };
    matchedKeywords: string[];
    missingKeywords: string[];
    jobSpecificRecommendations: string[];
    weakSections: string[];
    jobSpecific: boolean;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    analyzedAt: string;
  };
}

export interface ResumeVersion {
  _id: string;
  resumeId: string;
  userId: string;
  versionNumber: number;
  source: "created" | "upload" | "manual" | "ai_improvement" | "checkpoint" | "restore";
  content?: Partial<Resume>;
  changes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ResumeVersionsResponse {
  success: boolean;
  data: ResumeVersion[];
}

export interface ResumeVersionResponse {
  success: boolean;
  data: ResumeVersion;
}

export interface ImproveResumeResponse {
  success: boolean;
  message: string;
  data: Resume;
  changes: string[];
}

export interface ResumeTailoringResponse {
  success: boolean;
  message: string;
  data: {
    summary: string;
    experience: Array<{ index: number; description: string }>;
    projects: Array<{ index: number; description: string }>;
    achievements: Array<{ index: number; description: string }>;
    changes: string[];
  };
}

export interface CareerGapResponse {
  success: boolean;
  data: {
    targetRole: string;
    evidenceJobCount: number;
    strongSkills: string[];
    skillsToImprove: string[];
    missingSkills: string[];
    experienceGaps: string[];
    learningTopics: string[];
    roadmap: Array<{ focus: string; reason: string; relatedGap: string }>;
  };
}

export interface JobMatchResponse {
  success: boolean;
  message: string;
  data: {
    matchScore: number;
    categories: {
      skills: number;
      experience: number;
      education: number;
      keywords: number;
      location: number | null;
    };
    matchedSkills: string[];
    missingSkills: string[];
    matchedKeywords: string[];
    missingKeywords: string[];
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

export interface CoverLetterResponse {
  success: boolean;
  message: string;
  data: {
    coverLetter: string;
  };
}

export type CreateResumeRequest = Omit<
  Resume,
  | "_id"
  | "id"
  | "status"
  | "isDefault"
  | "isPublic"
  | "publicSlug"
  | "atsScore"
  | "aiSummary"
  | "createdAt"
  | "updatedAt"
>;

export type UpdateResumeRequest = Partial<CreateResumeRequest>;