import { AuthService } from '@/lib/api/auth';
import { UserRole } from '@/types/api';

// Mock the API client
jest.mock('@/lib/api/client', () => ({
  post: jest.fn(),
  get: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  setAuthTokens: jest.fn(),
  clearAuth: jest.fn(),
  isAuthenticated: jest.fn(),
}));

import apiClient from '@/lib/api/client';

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockResponse = {
        user: {
          _id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: UserRole.CONSUMER,
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 3600,
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await AuthService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });

      expect(mockApiClient.setAuthTokens).toHaveBeenCalledWith(
        'mock-access-token',
        'mock-refresh-token'
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle login failure', async () => {
      const mockError = {
        response: {
          data: {
            statusCode: 401,
            message: 'Invalid credentials',
            error: 'Unauthorized',
            timestamp: new Date().toISOString(),
            path: '/auth/login',
          },
        },
      };

      mockApiClient.post.mockRejectedValue(mockError);

      await expect(
        AuthService.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow();

      expect(mockApiClient.setAuthTokens).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should register successfully with valid data', async () => {
      const mockResponse = {
        user: {
          _id: '1',
          email: 'newuser@example.com',
          name: 'New User',
          role: UserRole.CONSUMER,
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 3600,
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await AuthService.register({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        phone: '+1234567890',
      });

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/register', {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        phone: '+1234567890',
      });

      expect(mockApiClient.setAuthTokens).toHaveBeenCalledWith(
        'mock-access-token',
        'mock-refresh-token'
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockApiClient.post.mockResolvedValue({});

      await AuthService.logout();

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/logout');
      expect(mockApiClient.clearAuth).toHaveBeenCalled();
    });

    it('should clear auth even if server logout fails', async () => {
      mockApiClient.post.mockRejectedValue(new Error('Network error'));

      await AuthService.logout();

      expect(mockApiClient.clearAuth).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockResponse = {
        user: {
          _id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: UserRole.CONSUMER,
        },
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 3600,
      };

      // Mock localStorage
      const mockGetItem = jest.fn().mockReturnValue('old-refresh-token');
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: mockGetItem,
        },
        writable: true,
      });

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await AuthService.refreshToken();

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/refresh', {
        refreshToken: 'old-refresh-token',
      });

      expect(mockApiClient.setAuthTokens).toHaveBeenCalledWith(
        'new-access-token',
        'new-refresh-token'
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle refresh token failure', async () => {
      const mockGetItem = jest.fn().mockReturnValue(null);
      Object.defineProperty(window, 'localStorage', {
        value: {
          getItem: mockGetItem,
        },
        writable: true,
      });

      await expect(AuthService.refreshToken()).rejects.toThrow('No refresh token available');
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUser = {
        _id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: UserRole.CONSUMER,
      };

      mockApiClient.get.mockResolvedValue(mockUser);

      const result = await AuthService.getCurrentUser();

      expect(mockApiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(result).toEqual(mockUser);
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const mockUpdatedUser = {
        _id: '1',
        email: 'test@example.com',
        name: 'Updated Name',
        role: UserRole.CONSUMER,
      };

      mockApiClient.patch.mockResolvedValue(mockUpdatedUser);

      const result = await AuthService.updateProfile({
        name: 'Updated Name',
      });

      expect(mockApiClient.patch).toHaveBeenCalledWith('/auth/profile', {
        name: 'Updated Name',
      });

      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('forgotPassword', () => {
    it('should send forgot password email successfully', async () => {
      const mockResponse = {
        data: { message: 'Password reset email sent' },
        message: 'Email sent successfully',
        success: true,
        timestamp: new Date().toISOString(),
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await AuthService.forgotPassword('test@example.com');

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/forgot-password', {
        email: 'test@example.com',
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const mockResponse = {
        data: { message: 'Password reset successfully' },
        message: 'Password updated',
        success: true,
        timestamp: new Date().toISOString(),
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await AuthService.resetPassword('reset-token', 'newpassword123');

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/reset-password', {
        token: 'reset-token',
        password: 'newpassword123',
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const mockResponse = {
        data: { message: 'Password changed successfully' },
        message: 'Password updated',
        success: true,
        timestamp: new Date().toISOString(),
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await AuthService.changePassword('oldpassword', 'newpassword123');

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/change-password', {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const mockResponse = {
        data: { message: 'Email verified successfully' },
        message: 'Email verified',
        success: true,
        timestamp: new Date().toISOString(),
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await AuthService.verifyEmail('verification-token');

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/verify-email', {
        token: 'verification-token',
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('verifyPhone', () => {
    it('should verify phone successfully', async () => {
      const mockResponse = {
        data: { message: 'Phone verified successfully' },
        message: 'Phone verified',
        success: true,
        timestamp: new Date().toISOString(),
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await AuthService.verifyPhone('+1234567890', '123456');

      expect(mockApiClient.post).toHaveBeenCalledWith('/auth/verify-phone', {
        phone: '+1234567890',
        otp: '123456',
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when user is authenticated', () => {
      mockApiClient.isAuthenticated.mockReturnValue(true);

      const result = AuthService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
      mockApiClient.isAuthenticated.mockReturnValue(false);

      const result = AuthService.isAuthenticated();

      expect(result).toBe(false);
    });
  });
});
