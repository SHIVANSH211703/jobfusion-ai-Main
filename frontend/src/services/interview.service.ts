import axiosInstance from "@/lib/axios";
import { API } from "@/constants/api";
import type {
  CreateInterviewRequest,
  InterviewResponse,
  InterviewsResponse,
  InterviewPreparationResponse,
  UpdateInterviewRequest,
} from "@/types/interview";

class InterviewService {
  async getInterviews(): Promise<InterviewsResponse> {
    const response = await axiosInstance.get<InterviewsResponse>(API.INTERVIEWS.GET_ALL);
    return response.data;
  }

  async create(payload: CreateInterviewRequest): Promise<InterviewResponse> {
    const response = await axiosInstance.post<InterviewResponse>(API.INTERVIEWS.CREATE, payload);
    return response.data;
  }

  async prepare(applicationId: string): Promise<InterviewPreparationResponse> {
    const response = await axiosInstance.post<InterviewPreparationResponse>(
      API.INTERVIEWS.PREPARE,
      { applicationId }
    );
    return response.data;
  }

  async update(id: string, payload: UpdateInterviewRequest): Promise<InterviewResponse> {
    const response = await axiosInstance.patch<InterviewResponse>(API.INTERVIEWS.UPDATE(id), payload);
    return response.data;
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const response = await axiosInstance.delete<{ success: boolean }>(API.INTERVIEWS.DELETE(id));
    return response.data;
  }
}

export default new InterviewService();