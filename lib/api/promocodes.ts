
import apiClient from './client';
import {
  PromoCode,
  PromoCodeRequest,
  ValidatePromoCodeRequest,
  ValidatePromoCodeResponse,
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
} from '@/types/api';

export class PromoCodesService {
  /**
   * Validate promo code
   */
  static async validatePromoCode(request: ValidatePromoCodeRequest): Promise<ValidatePromoCodeResponse> {
    try {
      return await apiClient.post<ValidatePromoCodeResponse>('/promocodes/validate', request);
    } catch (error) {
      throw PromoCodesService.handleError(error);
    }
  }

  /**
   * Apply promo code to booking
   */
  static async applyPromoCode(code: string, bookingId: string): Promise<ApiResponse<{
    discount: number;
    finalAmount: number;
    promoCode: PromoCode;
  }>> {
    try {
      return await apiClient.post<ApiResponse<{
        discount: number;
        finalAmount: number;
        promoCode: PromoCode;
      }>>('/promocodes/apply', { code, bookingId });
    } catch (error) {
      throw PromoCodesService.handleError(error);
    }
  }

  /**
   * Remove promo code from booking
   */
  static async removePromoCode(bookingId: string): Promise<ApiResponse<{
    originalAmount: number;
    message: string;
  }>> {
    try {
      return await apiClient.delete<ApiResponse<{
        originalAmount: number;
        message: string;
      }>>(`/promocodes/booking/${bookingId}`);
    } catch (error) {
      throw PromoCodesService.handleError(error);
    }
  }

  /**
   * Get all promo codes (admin only)
   */
  static async getPromoCodes(filters?: {
    status?: 'active' | 'inactive' | 'expired';
    type?: 'percentage' | 'fixed';
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<PromoCode>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      return await apiClient.get<PaginatedResponse<PromoCode>>(`/promocodes?${params.toString()}`);
    } catch (error) {
      throw PromoCodesService.handleError(error);
    }
  }

  /**
   * Get promo code by ID
   */
  static async getPromoCode(id: string): Promise<PromoCode> {
    try {
      return await apiClient.get<PromoCode>(`/promocodes/${id}`);
    } catch (error) {
      throw PromoCodesService.handleError(error);
    }
  }

  /**
   * Create new promo code (admin only)
   */
  static async createPromoCode(promoData: PromoCodeRequest): Promise<ApiResponse<{ promoCode: PromoCode; message: string }>> {
    try {
      return await apiClient.post<ApiResponse<{ promoCode: PromoCode; message: string }>>('/promocodes', promoData);
    } catch (error) {
      throw PromoCodesService.handleError(error);
    }
  }

  /**
   * Update promo code (admin only)
   */
  static async updatePromoCode(id: string, promoData: Partial<PromoCodeRequest>): Promise<ApiResponse<{ promoCode: PromoCode; message: string }>> {
    try {
      return await apiClient.patch<ApiResponse<{ promoCode: PromoCode; message: string }>>(`/promocodes/${id}`, promoData);
    } catch (error) {
      throw PromoCodesService.handleError(error);
    }
  }

  /**
   * Delete promo code (admin only)
   */
  static async deletePromoCode(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.delete<ApiResponse<{ message: string }>>(`/promocodes/${id}`);
    } catch (error) {
      throw PromoCodesService.handleError(error);
    }
  }

  /**
   * Toggle promo code status (admin only)
   */
  static async togglePromoCodeStatus(id: string, isActive: boolean): Promise<ApiResponse<{ promoCode: PromoCode; message: string }>> {
    try {
      return await apiClient.patch<ApiResponse<{ promoCode: PromoCode; message: string }>>(`/promocodes/${id}/status`, { isActive });
    } catch (error) {
      throw PromoCodesService.handleError(error);
    }
  }

  /**
   * Get promo code usage statistics
   */
  static async getPromoCodeStats(id: string): Promise<ApiResponse<{
    totalUsage: number;
    remainingUsage: number;
    totalDiscount: number;
    usageHistory: Array<{
      date: string;
      count: number;
      discount: number;
    }>;
  }>> {
    try {
      return await apiClient.get<ApiResponse<{
        totalUsage: number;
        remainingUsage: number;
        totalDiscount: number;
        usageHistory: Array<{
          date: string;
          count: number;
          discount: number;
        }>;
      }>>(`/promocodes/${id}/stats`);
    } catch (error) {
      throw PromoCodesService.handleError(error);
    }
  }

  /**
   * Get available promo codes for user
   */
  static async getAvailablePromoCodes(spaceId?: string): Promise<ApiResponse<PromoCode[]>> {
    try {
      const params = spaceId ? `?spaceId=${spaceId}` : '';
      return await apiClient.get<ApiResponse<PromoCode[]>>(`/promocodes/available${params}`);
    } catch (error) {
      throw PromoCodesService.handleError(error);
    }
  }

  /**
   * Get user's promo code usage history
   */
  static async getUserPromoCodeHistory(page = 1, limit = 20): Promise<PaginatedResponse<{
    promoCode: PromoCode;
    bookingId: string;
    discount: number;
    usedAt: Date;
  }>> {
    try {
      return await apiClient.get<PaginatedResponse<{
        promoCode: PromoCode;
        bookingId: string;
        discount: number;
        usedAt: Date;
      }>>(`/promocodes/history?page=${page}&limit=${limit}`);
    } catch (error) {
      throw PromoCodesService.handleError(error);
    }
  }

  /**
   * Generate promo code (admin only)
   */
  static async generatePromoCode(template: {
    prefix?: string;
    length?: number;
    type: 'percentage' | 'fixed';
    discount: number;
    validFrom: string;
    validTo: string;
    usageLimit?: number;
  }): Promise<ApiResponse<{ code: string; promoCode: PromoCode }>> {
    try {
      return await apiClient.post<ApiResponse<{ code: string; promoCode: PromoCode }>>('/promocodes/generate', template);
    } catch (error) {
      throw PromoCodesService.handleError(error);
    }
  }

  /**
   * Bulk create promo codes (admin only)
   */
  static async bulkCreatePromoCodes(promoData: {
    count: number;
    template: PromoCodeRequest;
  }): Promise<ApiResponse<{ codes: string[]; message: string }>> {
    try {
      return await apiClient.post<ApiResponse<{ codes: string[]; message: string }>>('/promocodes/bulk', promoData);
    } catch (error) {
      throw PromoCodesService.handleError(error);
    }
  }

  /**
   * Export promo codes (admin only)
   */
  static async exportPromoCodes(filters?: {
    status?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await apiClient.get(`/promocodes/export?${params.toString()}`, {
        responseType: 'blob',
      });
      
      return response as unknown as Blob;
    } catch (error) {
      throw PromoCodesService.handleError(error);
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
      message: 'Promo codes service error',
      error: 'Promo Codes Error',
      timestamp: new Date().toISOString(),
      path: '',
    };
  }
}

// Export individual functions for backward compatibility
export const validatePromoCode = PromoCodesService.validatePromoCode;
export const applyPromoCode = PromoCodesService.applyPromoCode;
export const removePromoCode = PromoCodesService.removePromoCode;
export const getPromoCodes = PromoCodesService.getPromoCodes;
export const getPromoCode = PromoCodesService.getPromoCode;
export const createPromoCode = PromoCodesService.createPromoCode;
export const updatePromoCode = PromoCodesService.updatePromoCode;
export const deletePromoCode = PromoCodesService.deletePromoCode;
export const togglePromoCodeStatus = PromoCodesService.togglePromoCodeStatus;
export const getPromoCodeStats = PromoCodesService.getPromoCodeStats;
export const getAvailablePromoCodes = PromoCodesService.getAvailablePromoCodes;
export const getUserPromoCodeHistory = PromoCodesService.getUserPromoCodeHistory;
export const generatePromoCode = PromoCodesService.generatePromoCode;
export const bulkCreatePromoCodes = PromoCodesService.bulkCreatePromoCodes;
export const exportPromoCodes = PromoCodesService.exportPromoCodes;
