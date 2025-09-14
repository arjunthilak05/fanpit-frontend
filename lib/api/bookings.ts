
import apiClient from './client';
import {
  Booking,
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingFilters,
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
} from '@/types/api';

export class BookingsService {
  /**
   * Check availability for a space
   */
  static async checkAvailability(spaceId: string, date: string, startTime: string, endTime: string): Promise<ApiResponse<{ available: boolean; conflicts?: any[] }>> {
    try {
      return await apiClient.post<ApiResponse<{ available: boolean; conflicts?: any[] }>>(
        `/bookings/check-availability`,
        { spaceId, date, startTime, endTime }
      );
    } catch (error) {
      throw BookingsService.handleError(error);
    }
  }

  /**
   * Create a new booking
   */
  static async createBooking(bookingData: CreateBookingRequest): Promise<Booking> {
    try {
      return await apiClient.post<Booking>('/bookings', bookingData);
    } catch (error) {
      throw BookingsService.handleError(error);
    }
  }

  /**
   * Get user's bookings
   */
  static async getMyBookings(filters?: BookingFilters): Promise<PaginatedResponse<Booking>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      return await apiClient.get<PaginatedResponse<Booking>>(`/bookings/my?${params.toString()}`);
    } catch (error) {
      throw BookingsService.handleError(error);
    }
  }

  /**
   * Get booking by ID
   */
  static async getBooking(id: string): Promise<Booking> {
    try {
      return await apiClient.get<Booking>(`/bookings/${id}`);
    } catch (error) {
      throw BookingsService.handleError(error);
    }
  }

  /**
   * Update booking
   */
  static async updateBooking(id: string, bookingData: Partial<UpdateBookingRequest>): Promise<Booking> {
    try {
      return await apiClient.patch<Booking>(`/bookings/${id}`, bookingData);
    } catch (error) {
      throw BookingsService.handleError(error);
    }
  }

  /**
   * Cancel booking
   */
  static async cancelBooking(id: string, reason?: string): Promise<ApiResponse<{ message: string; refundAmount?: number }>> {
    try {
      return await apiClient.patch<ApiResponse<{ message: string; refundAmount?: number }>>(
        `/bookings/${id}/cancel`,
        { reason }
      );
    } catch (error) {
      throw BookingsService.handleError(error);
    }
  }

  /**
   * Confirm booking (for space owners)
   */
  static async confirmBooking(id: string): Promise<Booking> {
    try {
      return await apiClient.patch<Booking>(`/bookings/${id}/confirm`);
    } catch (error) {
      throw BookingsService.handleError(error);
    }
  }

  /**
   * Check in guest (for staff)
   */
  static async checkInGuest(id: string, notes?: string): Promise<Booking> {
    try {
      return await apiClient.patch<Booking>(`/bookings/${id}/check-in`, { notes });
    } catch (error) {
      throw BookingsService.handleError(error);
    }
  }

  /**
   * Check out guest (for staff)
   */
  static async checkOutGuest(id: string, notes?: string): Promise<Booking> {
    try {
      return await apiClient.patch<Booking>(`/bookings/${id}/check-out`, { notes });
    } catch (error) {
      throw BookingsService.handleError(error);
    }
  }

  /**
   * Mark as no-show (for staff)
   */
  static async markNoShow(id: string, notes?: string): Promise<Booking> {
    try {
      return await apiClient.patch<Booking>(`/bookings/${id}/no-show`, { notes });
    } catch (error) {
      throw BookingsService.handleError(error);
    }
  }

  /**
   * Get bookings for a specific space (for space owners)
   */
  static async getSpaceBookings(spaceId: string, filters?: BookingFilters): Promise<PaginatedResponse<Booking>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      return await apiClient.get<PaginatedResponse<Booking>>(`/bookings/space/${spaceId}?${params.toString()}`);
    } catch (error) {
      throw BookingsService.handleError(error);
    }
  }

  /**
   * Get today's bookings (for staff)
   */
  static async getTodaysBookings(spaceId?: string): Promise<Booking[]> {
    try {
      const params = spaceId ? `?spaceId=${spaceId}` : '';
      const response = await apiClient.get<PaginatedResponse<Booking>>(`/bookings/today${params}`);
      return response.data;
    } catch (error) {
      throw BookingsService.handleError(error);
    }
  }

  /**
   * Get upcoming bookings
   */
  static async getUpcomingBookings(limit = 10): Promise<Booking[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<Booking>>(`/bookings/upcoming?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw BookingsService.handleError(error);
    }
  }

  /**
   * Get booking history
   */
  static async getBookingHistory(filters?: BookingFilters): Promise<PaginatedResponse<Booking>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      return await apiClient.get<PaginatedResponse<Booking>>(`/bookings/history?${params.toString()}`);
    } catch (error) {
      throw BookingsService.handleError(error);
    }
  }

  /**
   * Add booking review
   */
  static async addBookingReview(bookingId: string, rating: number, review: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<ApiResponse<{ message: string }>>(`/bookings/${bookingId}/review`, {
        rating,
        review,
      });
    } catch (error) {
      throw BookingsService.handleError(error);
    }
  }

  /**
   * Get booking analytics
   */
  static async getBookingAnalytics(spaceId?: string, period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<any>> {
    try {
      const params = new URLSearchParams({ period });
      if (spaceId) params.append('spaceId', spaceId);
      
      return await apiClient.get<ApiResponse<any>>(`/bookings/analytics?${params.toString()}`);
    } catch (error) {
      throw BookingsService.handleError(error);
    }
  }

  /**
   * Get booking statistics
   */
  static async getBookingStats(): Promise<ApiResponse<{
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    completed: number;
    revenue: number;
  }>> {
    try {
      return await apiClient.get<ApiResponse<{
        total: number;
        confirmed: number;
        pending: number;
        cancelled: number;
        completed: number;
        revenue: number;
      }>>('/bookings/stats');
    } catch (error) {
      throw BookingsService.handleError(error);
    }
  }

  /**
   * Export bookings to CSV
   */
  static async exportBookings(filters?: BookingFilters): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await apiClient.get(`/bookings/export?${params.toString()}`, {
        responseType: 'blob',
      });
      
      return response as unknown as Blob;
    } catch (error) {
      throw BookingsService.handleError(error);
    }
  }

  /**
   * Send booking reminder
   */
  static async sendBookingReminder(bookingId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<ApiResponse<{ message: string }>>(`/bookings/${bookingId}/reminder`);
    } catch (error) {
      throw BookingsService.handleError(error);
    }
  }

  /**
   * Get booking calendar data
   */
  static async getBookingCalendar(spaceId: string, month: string, year: string): Promise<ApiResponse<{ date: string; bookings: number; revenue: number }[]>> {
    try {
      return await apiClient.get<ApiResponse<{ date: string; bookings: number; revenue: number }[]>>(
        `/bookings/calendar/${spaceId}?month=${month}&year=${year}`
      );
    } catch (error) {
      throw BookingsService.handleError(error);
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
      message: 'Bookings service error',
      error: 'Bookings Error',
      timestamp: new Date().toISOString(),
      path: '',
    };
  }
}

// Export individual functions for backward compatibility
export const checkAvailability = BookingsService.checkAvailability;
export const createBooking = BookingsService.createBooking;
export const getMyBookings = BookingsService.getMyBookings;
export const getBooking = BookingsService.getBooking;
export const updateBooking = BookingsService.updateBooking;
export const cancelBooking = BookingsService.cancelBooking;
export const confirmBooking = BookingsService.confirmBooking;
export const checkInGuest = BookingsService.checkInGuest;
export const checkOutGuest = BookingsService.checkOutGuest;
export const markNoShow = BookingsService.markNoShow;
export const getSpaceBookings = BookingsService.getSpaceBookings;
export const getTodaysBookings = BookingsService.getTodaysBookings;
export const getUpcomingBookings = BookingsService.getUpcomingBookings;
export const getBookingHistory = BookingsService.getBookingHistory;
export const addBookingReview = BookingsService.addBookingReview;
export const getBookingAnalytics = BookingsService.getBookingAnalytics;
export const getBookingStats = BookingsService.getBookingStats;
export const exportBookings = BookingsService.exportBookings;
export const sendBookingReminder = BookingsService.sendBookingReminder;
export const getBookingCalendar = BookingsService.getBookingCalendar;
