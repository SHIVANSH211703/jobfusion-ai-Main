import axiosInstance from "@/lib/axios";
import { API } from "@/constants/api";

import type { ApplicationAnalyticsResponse, DashboardResponse } from "@/types/dashboard";

class DashboardService {
  async getDashboard(): Promise<DashboardResponse> {
    const response = await axiosInstance.get<DashboardResponse>(
      API.DASHBOARD.GET
    );

    return response.data;
  }

  async getAnalytics(): Promise<ApplicationAnalyticsResponse> {
    const response = await axiosInstance.get<ApplicationAnalyticsResponse>(API.DASHBOARD.ANALYTICS);
    return response.data;
  }
}

export default new DashboardService();
