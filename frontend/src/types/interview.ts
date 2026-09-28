import type { JobApplication } from "@/types/job";

export type InterviewRound = "technical" | "hr" | "managerial" | "behavioral" | "other";
export type InterviewType = "phone" | "video" | "onsite" | "other";
export type InterviewStatus = "scheduled" | "completed" | "cancelled";

export interface Interview {
  _id: string;
  applicationId: JobApplication | string;
  round: InterviewRound;
  type: InterviewType;
  scheduledAt: string;
  interviewer: string;
  notes: string;
  status: InterviewStatus;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewResponse {
  success: boolean;
  data: Interview;
}

export interface InterviewsResponse {
  success: boolean;
  data: Interview[];
}

export interface CreateInterviewRequest {
  applicationId: string;
  round: InterviewRound;
  type: InterviewType;
  scheduledAt: string;
  interviewer?: string;
  notes?: string;
}

export type UpdateInterviewRequest = Partial<Omit<CreateInterviewRequest, "applicationId">> & {
  status?: InterviewStatus;
  feedback?: string;
};

export interface InterviewPreparation {
  technicalQuestions: Array<{ question: string; context: string }>;
  behavioralQuestions: Array<{ question: string; context: string }>;
  resumeQuestions: Array<{ question: string; context: string }>;
  jobSpecificQuestions: Array<{ question: string; context: string }>;
}

export interface InterviewPreparationResponse {
  success: boolean;
  data: InterviewPreparation;
}