import axiosInstance from "@/lib/axios";
import { API } from "@/constants/api";
import type { NotificationsResponse } from "@/types/notification";

class NotificationService {
  async getNotifications(): Promise<NotificationsResponse> {
    const response = await axiosInstance.get<NotificationsResponse>(API.NOTIFICATIONS.GET_ALL);
    return response.data;
  }

  async markRead(id: string): Promise<void> {
    await axiosInstance.patch(API.NOTIFICATIONS.READ(id));
  }

  async markAllRead(): Promise<void> {
    await axiosInstance.patch(API.NOTIFICATIONS.READ_ALL);
  }
}

export default new NotificationService();