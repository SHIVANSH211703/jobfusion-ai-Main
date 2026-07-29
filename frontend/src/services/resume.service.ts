import axiosInstance from "@/lib/axios";
import { API } from "@/constants/api";

import type {
  ResumeResponse,
  ResumeListResponse,
  UpdateResumeRequest,
  CreateResumeRequest,
} from "@/types/resume";

interface MessageResponse {
  success: boolean;
  message: string;
}

interface ATSAnalysisResponse {
  success: boolean;
  message: string;
  data: any;
}

interface JobMatchRequest {
  jobDescription: string;
}

interface CoverLetterRequest {
  jobDescription: string;
  tone?: string;
}

class ResumeService {
  async getResumes(): Promise<ResumeListResponse> {
    const response = await axiosInstance.get<ResumeListResponse>(
      API.RESUME.GET_ALL
    );

    return response.data;
  }

  async getResumeById(id: string): Promise<ResumeResponse> {
    const response = await axiosInstance.get<ResumeResponse>(
      API.RESUME.GET_BY_ID(id)
    );

    return response.data;
  }

  async createResume(
    payload: CreateResumeRequest
  ): Promise<ResumeResponse> {
    const response = await axiosInstance.post<ResumeResponse>(
      API.RESUME.CREATE,
      payload
    );

    return response.data;
  }

  async updateResume(
    id: string,
    payload: UpdateResumeRequest
  ): Promise<ResumeResponse> {
    const response = await axiosInstance.put<ResumeResponse>(
      API.RESUME.UPDATE(id),
      payload
    );

    return response.data;
  }

  async deleteResume(id: string): Promise<MessageResponse> {
    const response = await axiosInstance.delete<MessageResponse>(
      API.RESUME.DELETE(id)
    );

    return response.data;
  }

  async analyzeResume(id: string): Promise<ATSAnalysisResponse> {
    const response = await axiosInstance.post<ATSAnalysisResponse>(
      API.RESUME.ANALYZE(id)
    );

    return response.data;
  }

  async improveResume(id: string): Promise<ATSAnalysisResponse> {
    const response = await axiosInstance.post<ATSAnalysisResponse>(
      API.RESUME.IMPROVE(id)
    );

    return response.data;
  }

  async jobMatch(
    id: string,
    payload: JobMatchRequest
  ): Promise<ATSAnalysisResponse> {
    const response = await axiosInstance.post<ATSAnalysisResponse>(
      API.RESUME.JOB_MATCH(id),
      payload
    );

    return response.data;
  }

  async generateCoverLetter(
    id: string,
    payload: CoverLetterRequest
  ): Promise<ATSAnalysisResponse> {
    const response = await axiosInstance.post<ATSAnalysisResponse>(
      API.RESUME.COVER_LETTER(id),
      payload
    );

    return response.data;
  }
}

const resumeService = new ResumeService();

export default resumeService;