import axios from "axios";
import axiosInstance from "@/lib/axios";
import { API } from "@/constants/api";

import type {
  ResumeResponse,
  ResumeListResponse,
  CreateResumeRequest,
  UpdateResumeRequest,
  ATSAnalysisResponse,
  ImproveResumeResponse,
  JobMatchResponse,
  CoverLetterResponse,
  ResumeVersionsResponse,
  ResumeVersionResponse,
  ResumeTailoringResponse,
  CareerGapResponse,
} from "@/types/resume";

interface MessageResponse {
  success: boolean;
  message: string;
}

interface JobMatchRequest {
  jobDescription: string;
}

interface AnalyzeResumeRequest {
  jobDescription?: string;
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

  async getResumeById(
    id: string
  ): Promise<ResumeResponse> {
    const response =
      await axiosInstance.get<ResumeResponse>(
        API.RESUME.GET_BY_ID(id)
      );

    return response.data;
  }

  async createResume(
    payload: CreateResumeRequest
  ): Promise<ResumeResponse> {
    const response =
      await axiosInstance.post<ResumeResponse>(
        API.RESUME.CREATE,
        payload
      );

    return response.data;
  }

  async uploadResume(
  file: File
): Promise<{
  success: boolean;
  message: string;
  data: {
    uploadId: string;
    resumeId: string;
  };
}> {
  const formData = new FormData();

  formData.append("resume", file);

  const response =
    await axiosInstance.post(
      API.RESUME.UPLOAD,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

  return response.data;
  }

  async updateResume(
    id: string,
    payload: UpdateResumeRequest
  ): Promise<ResumeResponse> {
    const response =
      await axiosInstance.put<ResumeResponse>(
        API.RESUME.UPDATE(id),
        payload
      );

    return response.data;
  }

  async deleteResume(
    id: string
  ): Promise<MessageResponse> {
    const response =
      await axiosInstance.delete<MessageResponse>(
        API.RESUME.DELETE(id)
      );

    return response.data;
  }

  async analyzeResume(
    id: string,
    payload?: AnalyzeResumeRequest
  ): Promise<ATSAnalysisResponse> {
    const response =
      await axiosInstance.post<ATSAnalysisResponse>(
        API.RESUME.ANALYZE(id),
        payload ?? {}
      );

    return response.data;
  }

  async improveResume(
    id: string
  ): Promise<ImproveResumeResponse> {
    const response =
      await axiosInstance.post<ImproveResumeResponse>(
        API.RESUME.IMPROVE(id)
      );

    return response.data;
  }

  async tailorResume(id: string, jobDescription: string): Promise<ResumeTailoringResponse> {
    const response = await axiosInstance.post<ResumeTailoringResponse>(
      API.RESUME.TAILOR(id),
      { jobDescription }
    );
    return response.data;
  }

  async analyzeCareerGap(id: string, targetRole: string): Promise<CareerGapResponse> {
    const response = await axiosInstance.post<CareerGapResponse>(API.RESUME.CAREER_GAP(id), { targetRole });
    return response.data;
  }

  async jobMatch(
    id: string,
    payload: JobMatchRequest
  ): Promise<JobMatchResponse> {
    const response =
      await axiosInstance.post<JobMatchResponse>(
        API.RESUME.JOB_MATCH(id),
        payload
      );

    return response.data;
  }

  async generateCoverLetter(
    id: string,
    payload: CoverLetterRequest
  ): Promise<CoverLetterResponse> {
    const response =
      await axiosInstance.post<CoverLetterResponse>(
        API.RESUME.COVER_LETTER(id),
        payload
      );

    return response.data;
  }

  async getVersions(id: string): Promise<ResumeVersionsResponse> {
    const response = await axiosInstance.get<ResumeVersionsResponse>(API.RESUME.VERSIONS(id));
    return response.data;
  }

  async getVersion(id: string, versionId: string): Promise<ResumeVersionResponse> {
    const response = await axiosInstance.get<ResumeVersionResponse>(API.RESUME.VERSION(id, versionId));
    return response.data;
  }

  async createVersion(id: string): Promise<ResumeVersionResponse> {
    const response = await axiosInstance.post<ResumeVersionResponse>(API.RESUME.VERSIONS(id));
    return response.data;
  }

  async restoreVersion(id: string, versionId: string): Promise<ResumeResponse> {
    const response = await axiosInstance.post<ResumeResponse>(API.RESUME.RESTORE_VERSION(id, versionId));
    return response.data;
  }

  getResumeFileUrl(id: string, download: boolean = false): string {
    return `${API.BASE_URL}${API.RESUME.GET_FILE(id)}${download ? "?download=true" : ""}`;
  }

  async getResumeFileArrayBuffer(id: string): Promise<ArrayBuffer> {
    try {
      const response = await axiosInstance.get<ArrayBuffer>(
        API.RESUME.GET_FILE(id),
        {
          responseType: "arraybuffer",
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        if (error.response.data instanceof ArrayBuffer) {
          try {
            const text = new TextDecoder().decode(error.response.data);
            const parsed = JSON.parse(text);
            if (parsed.message) {
              throw new Error(parsed.message);
            }
          } catch (decodeErr: unknown) {
            if (decodeErr instanceof Error && decodeErr.message !== (error.message || "Failed to fetch file")) {
              throw decodeErr;
            }
          }
        }
      }
      throw error;
    }
  }

  async downloadResumeFile(id: string, fileName: string = "Resume.pdf"): Promise<void> {
    const response = await axiosInstance.get(
      `${API.RESUME.GET_FILE(id)}?download=true`,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data]);
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  }
}

export default new ResumeService();