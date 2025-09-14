
import apiClient from './client';
import {
  StaffActivity,
  Booking,
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
} from '@/types/api';

export interface IssueReport {
  type: 'maintenance' | 'cleaning' | 'security' | 'equipment' | 'other';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  spaceId?: string;
  bookingId?: string;
  images?: File[];
}

export interface StaffDashboard {
  todayBookings: Booking[];
  upcomingBookings: Booking[];
  completedBookings: Booking[];
  issues: any[];
  activityLog: StaffActivity[];
  stats: {
    totalCheckIns: number;
    totalCheckOuts: number;
    noShows: number;
    issuesReported: number;
  };
}

export class StaffService {
  /**
   * Get daily reservations for a space
   */
  static async getDailyReservations(spaceId: string, date?: string): Promise<Booking[]> {
    try {
      const params = date ? `?date=${date}` : '';
      const response = await apiClient.get<PaginatedResponse<Booking>>(`/staff/spaces/${spaceId}/reservations${params}`);
      return response.data;
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Get staff dashboard data
   */
  static async getStaffDashboard(spaceId?: string): Promise<StaffDashboard> {
    try {
      const params = spaceId ? `?spaceId=${spaceId}` : '';
      return await apiClient.get<StaffDashboard>(`/staff/dashboard${params}`);
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Check in guest
   */
  static async checkInGuest(bookingId: string, notes?: string): Promise<Booking> {
    try {
      return await apiClient.patch<Booking>(`/staff/bookings/${bookingId}/check-in`, { notes });
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Check out guest
   */
  static async checkOutGuest(bookingId: string, notes?: string): Promise<Booking> {
    try {
      return await apiClient.patch<Booking>(`/staff/bookings/${bookingId}/check-out`, { notes });
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Mark guest as no-show
   */
  static async markNoShow(bookingId: string, notes?: string): Promise<Booking> {
    try {
      return await apiClient.patch<Booking>(`/staff/bookings/${bookingId}/no-show`, { notes });
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Report an issue
   */
  static async reportIssue(issueData: IssueReport): Promise<ApiResponse<{ issueId: string; message: string }>> {
    try {
      const formData = new FormData();
      formData.append('type', issueData.type);
      formData.append('title', issueData.title);
      formData.append('description', issueData.description);
      formData.append('priority', issueData.priority);
      
      if (issueData.spaceId) formData.append('spaceId', issueData.spaceId);
      if (issueData.bookingId) formData.append('bookingId', issueData.bookingId);
      
      if (issueData.images) {
        issueData.images.forEach(image => {
          formData.append('images', image);
        });
      }

      return await apiClient.post<ApiResponse<{ issueId: string; message: string }>>('/staff/issues', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Get activity log for a space
   */
  static async getActivityLog(spaceId: string, page = 1, limit = 20): Promise<PaginatedResponse<StaffActivity>> {
    try {
      return await apiClient.get<PaginatedResponse<StaffActivity>>(`/staff/spaces/${spaceId}/activity-log?page=${page}&limit=${limit}`);
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Get all issues
   */
  static async getIssues(filters?: {
    status?: string;
    priority?: string;
    type?: string;
    spaceId?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<any>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      return await apiClient.get<PaginatedResponse<any>>(`/staff/issues?${params.toString()}`);
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Update issue status
   */
  static async updateIssueStatus(issueId: string, status: string, notes?: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.patch<ApiResponse<{ message: string }>>(`/staff/issues/${issueId}/status`, {
        status,
        notes,
      });
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Get issue by ID
   */
  static async getIssue(issueId: string): Promise<any> {
    try {
      return await apiClient.get<any>(`/staff/issues/${issueId}`);
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Get today's schedule
   */
  static async getTodaysSchedule(spaceId?: string): Promise<Booking[]> {
    try {
      const params = spaceId ? `?spaceId=${spaceId}` : '';
      const response = await apiClient.get<PaginatedResponse<Booking>>(`/staff/schedule/today${params}`);
      return response.data;
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Get upcoming schedule
   */
  static async getUpcomingSchedule(spaceId?: string, days = 7): Promise<Booking[]> {
    try {
      const params = new URLSearchParams({ days: days.toString() });
      if (spaceId) params.append('spaceId', spaceId);
      
      const response = await apiClient.get<PaginatedResponse<Booking>>(`/staff/schedule/upcoming?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Get staff statistics
   */
  static async getStaffStats(spaceId?: string, period: 'day' | 'week' | 'month' = 'month'): Promise<ApiResponse<{
    totalCheckIns: number;
    totalCheckOuts: number;
    noShows: number;
    issuesReported: number;
    averageCheckInTime: number;
    averageCheckOutTime: number;
    customerSatisfaction: number;
  }>> {
    try {
      const params = new URLSearchParams({ period });
      if (spaceId) params.append('spaceId', spaceId);
      
      return await apiClient.get<ApiResponse<{
        totalCheckIns: number;
        totalCheckOuts: number;
        noShows: number;
        issuesReported: number;
        averageCheckInTime: number;
        averageCheckOutTime: number;
        customerSatisfaction: number;
      }>>(`/staff/stats?${params.toString()}`);
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Scan QR code for check-in
   */
  static async scanQRCode(qrData: string): Promise<ApiResponse<{
    booking: Booking;
    action: 'check-in' | 'check-out' | 'already-checked-in' | 'invalid';
  }>> {
    try {
      return await apiClient.post<ApiResponse<{
        booking: Booking;
        action: 'check-in' | 'check-out' | 'already-checked-in' | 'invalid';
      }>>('/staff/scan-qr', { qrData });
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Generate QR code for booking
   */
  static async generateQRCode(bookingId: string): Promise<ApiResponse<{ qrCode: string; qrData: string }>> {
    try {
      return await apiClient.get<ApiResponse<{ qrCode: string; qrData: string }>>(`/staff/bookings/${bookingId}/qr-code`);
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Get maintenance schedule
   */
  static async getMaintenanceSchedule(spaceId?: string): Promise<ApiResponse<{
    scheduled: any[];
    overdue: any[];
    upcoming: any[];
  }>> {
    try {
      const params = spaceId ? `?spaceId=${spaceId}` : '';
      return await apiClient.get<ApiResponse<{
        scheduled: any[];
        overdue: any[];
        upcoming: any[];
      }>>(`/staff/maintenance/schedule${params}`);
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Schedule maintenance
   */
  static async scheduleMaintenance(maintenanceData: {
    type: string;
    title: string;
    description: string;
    scheduledDate: string;
    spaceId?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
  }): Promise<ApiResponse<{ maintenanceId: string; message: string }>> {
    try {
      return await apiClient.post<ApiResponse<{ maintenanceId: string; message: string }>>('/staff/maintenance', maintenanceData);
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Complete maintenance task
   */
  static async completeMaintenance(maintenanceId: string, notes?: string, images?: File[]): Promise<ApiResponse<{ message: string }>> {
    try {
      const formData = new FormData();
      if (notes) formData.append('notes', notes);
      
      if (images) {
        images.forEach(image => {
          formData.append('images', image);
        });
      }

      return await apiClient.patch<ApiResponse<{ message: string }>>(`/staff/maintenance/${maintenanceId}/complete`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Get cleaning checklist
   */
  static async getCleaningChecklist(spaceId: string): Promise<ApiResponse<{
    checklist: Array<{
      id: string;
      task: string;
      completed: boolean;
      completedAt?: Date;
      completedBy?: string;
    }>;
  }>> {
    try {
      return await apiClient.get<ApiResponse<{
        checklist: Array<{
          id: string;
          task: string;
          completed: boolean;
          completedAt?: Date;
          completedBy?: string;
        }>;
      }>>(`/staff/cleaning/checklist/${spaceId}`);
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Update cleaning checklist
   */
  static async updateCleaningChecklist(spaceId: string, checklist: Array<{
    id: string;
    completed: boolean;
  }>): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.patch<ApiResponse<{ message: string }>>(`/staff/cleaning/checklist/${spaceId}`, { checklist });
    } catch (error) {
      throw StaffService.handleError(error);
    }
  }

  /**
   * Handle service errors
   */
  private static handleError(error: any): ErrorResponse {
    if (error.response) {
      return error.response.data as ErrorResponse;
    }
    
    return {
      statusCode: 500,
      message: 'Staff service error',
      error: 'Staff Error',
      timestamp: new Date().toISOString(),
      path: '',
    };
  }
}

// Export individual functions for backward compatibility
export const getDailyReservations = StaffService.getDailyReservations;
export const getStaffDashboard = StaffService.getStaffDashboard;
export const checkInGuest = StaffService.checkInGuest;
export const checkOutGuest = StaffService.checkOutGuest;
export const markNoShow = StaffService.markNoShow;
export const reportIssue = StaffService.reportIssue;
export const getActivityLog = StaffService.getActivityLog;
export const getIssues = StaffService.getIssues;
export const updateIssueStatus = StaffService.updateIssueStatus;
export const getIssue = StaffService.getIssue;
export const getTodaysSchedule = StaffService.getTodaysSchedule;
export const getUpcomingSchedule = StaffService.getUpcomingSchedule;
export const getStaffStats = StaffService.getStaffStats;
export const scanQRCode = StaffService.scanQRCode;
export const generateQRCode = StaffService.generateQRCode;
export const getMaintenanceSchedule = StaffService.getMaintenanceSchedule;
export const scheduleMaintenance = StaffService.scheduleMaintenance;
export const completeMaintenance = StaffService.completeMaintenance;
export const getCleaningChecklist = StaffService.getCleaningChecklist;
export const updateCleaningChecklist = StaffService.updateCleaningChecklist;
