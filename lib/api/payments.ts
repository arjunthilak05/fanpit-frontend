
import apiClient from './client';
import {
  Payment,
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
} from '@/types/api';

export interface CreateOrderRequest {
  bookingId: string;
  amount: number;
  currency?: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface VerifyPaymentRequest {
  orderId: string;
  paymentId: string;
  signature: string;
  bookingId: string;
}

export interface RefundRequest {
  amount?: number;
  reason: string;
  notes?: string;
}

export class PaymentsService {
  /**
   * Create Razorpay order
   */
  static async createOrder(orderData: CreateOrderRequest): Promise<ApiResponse<{
    orderId: string;
    amount: number;
    currency: string;
    key: string;
  }>> {
    try {
      return await apiClient.post<ApiResponse<{
        orderId: string;
        amount: number;
        currency: string;
        key: string;
      }>>('/payments/order', orderData);
    } catch (error) {
      throw PaymentsService.handleError(error);
    }
  }

  /**
   * Verify payment signature
   */
  static async verifyPayment(paymentData: VerifyPaymentRequest): Promise<ApiResponse<{
    success: boolean;
    payment: Payment;
    booking: any;
  }>> {
    try {
      return await apiClient.post<ApiResponse<{
        success: boolean;
        payment: Payment;
        booking: any;
      }>>('/payments/verify', paymentData);
    } catch (error) {
      throw PaymentsService.handleError(error);
    }
  }

  /**
   * Get payment history
   */
  static async getPaymentHistory(page = 1, limit = 20): Promise<PaginatedResponse<Payment>> {
    try {
      return await apiClient.get<PaginatedResponse<Payment>>(`/payments/history?page=${page}&limit=${limit}`);
    } catch (error) {
      throw PaymentsService.handleError(error);
    }
  }

  /**
   * Get payment by ID
   */
  static async getPayment(paymentId: string): Promise<Payment> {
    try {
      return await apiClient.get<Payment>(`/payments/${paymentId}`);
    } catch (error) {
      throw PaymentsService.handleError(error);
    }
  }

  /**
   * Get payments for a booking
   */
  static async getBookingPayments(bookingId: string): Promise<Payment[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<Payment>>(`/payments/booking/${bookingId}`);
      return response.data;
    } catch (error) {
      throw PaymentsService.handleError(error);
    }
  }

  /**
   * Process refund
   */
  static async processRefund(paymentId: string, refundData: RefundRequest): Promise<ApiResponse<{
    refundId: string;
    amount: number;
    status: string;
  }>> {
    try {
      return await apiClient.post<ApiResponse<{
        refundId: string;
        amount: number;
        status: string;
      }>>(`/payments/${paymentId}/refund`, refundData);
    } catch (error) {
      throw PaymentsService.handleError(error);
    }
  }

  /**
   * Get refund status
   */
  static async getRefundStatus(paymentId: string, refundId: string): Promise<ApiResponse<{
    refundId: string;
    amount: number;
    status: string;
    processedAt?: Date;
  }>> {
    try {
      return await apiClient.get<ApiResponse<{
        refundId: string;
        amount: number;
        status: string;
        processedAt?: Date;
      }>>(`/payments/${paymentId}/refund/${refundId}`);
    } catch (error) {
      throw PaymentsService.handleError(error);
    }
  }

  /**
   * Get payment analytics
   */
  static async getPaymentAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<{
    totalRevenue: number;
    totalTransactions: number;
    averageTransactionValue: number;
    successRate: number;
    refundRate: number;
    revenueByPeriod: Array<{ period: string; revenue: number }>;
  }>> {
    try {
      return await apiClient.get<ApiResponse<{
        totalRevenue: number;
        totalTransactions: number;
        averageTransactionValue: number;
        successRate: number;
        refundRate: number;
        revenueByPeriod: Array<{ period: string; revenue: number }>;
      }>>(`/payments/analytics?period=${period}`);
    } catch (error) {
      throw PaymentsService.handleError(error);
    }
  }

  /**
   * Get payment statistics
   */
  static async getPaymentStats(): Promise<ApiResponse<{
    totalRevenue: number;
    totalTransactions: number;
    pendingPayments: number;
    failedPayments: number;
    refundedAmount: number;
    todayRevenue: number;
  }>> {
    try {
      return await apiClient.get<ApiResponse<{
        totalRevenue: number;
        totalTransactions: number;
        pendingPayments: number;
        failedPayments: number;
        refundedAmount: number;
        todayRevenue: number;
      }>>('/payments/stats');
    } catch (error) {
      throw PaymentsService.handleError(error);
    }
  }

  /**
   * Get payment methods
   */
  static async getPaymentMethods(): Promise<ApiResponse<{
    methods: Array<{
      id: string;
      name: string;
      type: string;
      enabled: boolean;
      fees?: number;
    }>;
  }>> {
    try {
      return await apiClient.get<ApiResponse<{
        methods: Array<{
          id: string;
          name: string;
          type: string;
          enabled: boolean;
          fees?: number;
        }>;
      }>>('/payments/methods');
    } catch (error) {
      throw PaymentsService.handleError(error);
    }
  }

  /**
   * Update payment method settings (admin only)
   */
  static async updatePaymentMethod(methodId: string, settings: {
    enabled: boolean;
    fees?: number;
    settings?: Record<string, any>;
  }): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.patch<ApiResponse<{ message: string }>>(`/payments/methods/${methodId}`, settings);
    } catch (error) {
      throw PaymentsService.handleError(error);
    }
  }

  /**
   * Export payment data
   */
  static async exportPayments(filters?: {
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    method?: string;
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

      const response = await apiClient.get(`/payments/export?${params.toString()}`, {
        responseType: 'blob',
      });
      
      return response as unknown as Blob;
    } catch (error) {
      throw PaymentsService.handleError(error);
    }
  }

  /**
   * Get payment webhook logs
   */
  static async getWebhookLogs(page = 1, limit = 20): Promise<PaginatedResponse<{
    id: string;
    event: string;
    status: string;
    payload: any;
    response: any;
    timestamp: Date;
  }>> {
    try {
      return await apiClient.get<PaginatedResponse<{
        id: string;
        event: string;
        status: string;
        payload: any;
        response: any;
        timestamp: Date;
      }>>(`/payments/webhooks?page=${page}&limit=${limit}`);
    } catch (error) {
      throw PaymentsService.handleError(error);
    }
  }

  /**
   * Retry failed payment
   */
  static async retryPayment(paymentId: string): Promise<ApiResponse<{
    orderId: string;
    amount: number;
    currency: string;
    key: string;
  }>> {
    try {
      return await apiClient.post<ApiResponse<{
        orderId: string;
        amount: number;
        currency: string;
        key: string;
      }>>(`/payments/${paymentId}/retry`);
    } catch (error) {
      throw PaymentsService.handleError(error);
    }
  }

  /**
   * Cancel payment
   */
  static async cancelPayment(paymentId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.patch<ApiResponse<{ message: string }>>(`/payments/${paymentId}/cancel`);
    } catch (error) {
      throw PaymentsService.handleError(error);
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
      message: 'Payments service error',
      error: 'Payments Error',
      timestamp: new Date().toISOString(),
      path: '',
    };
  }
}

// Export individual functions for backward compatibility
export const createOrder = PaymentsService.createOrder;
export const verifyPayment = PaymentsService.verifyPayment;
export const getPaymentHistory = PaymentsService.getPaymentHistory;
export const getPayment = PaymentsService.getPayment;
export const getBookingPayments = PaymentsService.getBookingPayments;
export const processRefund = PaymentsService.processRefund;
export const getRefundStatus = PaymentsService.getRefundStatus;
export const getPaymentAnalytics = PaymentsService.getPaymentAnalytics;
export const getPaymentStats = PaymentsService.getPaymentStats;
export const getPaymentMethods = PaymentsService.getPaymentMethods;
export const updatePaymentMethod = PaymentsService.updatePaymentMethod;
export const exportPayments = PaymentsService.exportPayments;
export const getWebhookLogs = PaymentsService.getWebhookLogs;
export const retryPayment = PaymentsService.retryPayment;
export const cancelPayment = PaymentsService.cancelPayment;
