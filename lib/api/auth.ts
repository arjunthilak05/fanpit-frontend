
import apiClient from './client';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiResponse,
  ErrorResponse,
} from '@/types/api';

export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      // Store tokens in the API client
      apiClient.setAuthTokens(response.accessToken, response.refreshToken);
      
      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Register new user
   */
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', userData);
      
      // Store tokens in the API client
      apiClient.setAuthTokens(response.accessToken, response.refreshToken);
      
      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Logout user and clear tokens
   */
  static async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate tokens on server
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Even if server logout fails, clear local tokens
      console.warn('Server logout failed, clearing local tokens:', error);
    } finally {
      // Always clear local tokens
      apiClient.clearAuth();
    }
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(): Promise<AuthResponse> {
    try {
  const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<AuthResponse>('/auth/refresh', {
        refreshToken,
      } as RefreshTokenRequest);

      // Update tokens in the API client
      apiClient.setAuthTokens(response.accessToken, response.refreshToken);

      return response;
    } catch (error) {
      // Clear tokens on refresh failure
      apiClient.clearAuth();
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send forgot password email
   */
  static async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<ApiResponse<{ message: string }>>('/auth/forgot-password', {
        email,
      } as ForgotPasswordRequest);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token: string, password: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<ApiResponse<{ message: string }>>('/auth/reset-password', {
        token,
        password,
      } as ResetPasswordRequest);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User> {
    try {
      return await apiClient.get<User>('/auth/me');
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(profileData: Partial<User>): Promise<User> {
    try {
      return await apiClient.patch<User>('/auth/profile', profileData);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Change user password
   */
  static async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<ApiResponse<{ message: string }>>('/auth/change-password', {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Verify email with token
   */
  static async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<ApiResponse<{ message: string }>>('/auth/verify-email', {
        token,
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Resend email verification
   */
  static async resendEmailVerification(): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<ApiResponse<{ message: string }>>('/auth/resend-verification');
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Verify phone number with OTP
   */
  static async verifyPhone(phone: string, otp: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<ApiResponse<{ message: string }>>('/auth/verify-phone', {
        phone,
        otp,
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Send OTP to phone number
   */
  static async sendPhoneOTP(phone: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<ApiResponse<{ message: string }>>('/auth/send-phone-otp', {
        phone,
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Enable/disable two-factor authentication
   */
  static async toggleTwoFactor(enabled: boolean): Promise<ApiResponse<{ qrCode?: string; secret?: string }>> {
    try {
      return await apiClient.post<ApiResponse<{ qrCode?: string; secret?: string }>>('/auth/two-factor', {
        enabled,
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Verify two-factor authentication code
   */
  static async verifyTwoFactor(code: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<ApiResponse<{ message: string }>>('/auth/verify-two-factor', {
        code,
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get user activity log
   */
  static async getActivityLog(page = 1, limit = 20): Promise<ApiResponse<User['activityLog']>> {
    try {
      return await apiClient.get<ApiResponse<User['activityLog']>>(`/auth/activity?page=${page}&limit=${limit}`);
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Delete user account
   */
  static async deleteAccount(password: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.delete<ApiResponse<{ message: string }>>('/auth/account', {
        data: { password },
      });
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  /**
   * Get stored access token
   */
  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  /**
   * Get stored refresh token
   */
  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  /**
   * Handle authentication errors
   */
  private static handleAuthError(error: any): ErrorResponse {
    if (error.response) {
      return error.response.data as ErrorResponse;
    }
    
    return {
      statusCode: 500,
      message: 'Authentication service error',
      error: 'Auth Error',
      timestamp: new Date().toISOString(),
      path: '',
    };
  }
}

// Export individual functions for backward compatibility
export const login = AuthService.login;
export const register = AuthService.register;
export const logout = AuthService.logout;
export const refreshToken = AuthService.refreshToken;
export const forgotPassword = AuthService.forgotPassword;
export const resetPassword = AuthService.resetPassword;
export const getCurrentUser = AuthService.getCurrentUser;
export const updateProfile = AuthService.updateProfile;
export const changePassword = AuthService.changePassword;
export const verifyEmail = AuthService.verifyEmail;
export const resendEmailVerification = AuthService.resendEmailVerification;
export const verifyPhone = AuthService.verifyPhone;
export const sendPhoneOTP = AuthService.sendPhoneOTP;
export const toggleTwoFactor = AuthService.toggleTwoFactor;
export const verifyTwoFactor = AuthService.verifyTwoFactor;
export const getActivityLog = AuthService.getActivityLog;
export const deleteAccount = AuthService.deleteAccount;
export const isAuthenticated = AuthService.isAuthenticated;
export const getAccessToken = AuthService.getAccessToken;
export const getRefreshToken = AuthService.getRefreshToken;
