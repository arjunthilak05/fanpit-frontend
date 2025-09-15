import apiClient from './client';
import {
  User,
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
} from '@/types/api';

export class UsersService {
  /**
   * Get all users with pagination and filters
   */
  static async getAll(page = 1, limit = 10, role?: string, search?: string): Promise<PaginatedResponse<User>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (role) params.append('role', role);
      if (search) params.append('search', search);

      return await apiClient.get<PaginatedResponse<User>>(`/users?${params.toString()}`);
    } catch (error) {
      throw UsersService.handleError(error);
    }
  }

  /**
   * Get user statistics
   */
  static async getStatistics(): Promise<{
    total: number;
    active: number;
    newThisMonth: number;
    byRole: Record<string, number>;
  }> {
    try {
      return await apiClient.get<{
        total: number;
        active: number;
        newThisMonth: number;
        byRole: Record<string, number>;
      }>('/users/statistics/overview');
    } catch (error) {
      throw UsersService.handleError(error);
    }
  }

  /**
   * Get user by ID
   */
  static async getById(id: string): Promise<User> {
    try {
      return await apiClient.get<User>(`/users/${id}`);
    } catch (error) {
      throw UsersService.handleError(error);
    }
  }

  /**
   * Create new user
   */
  static async create(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
  }): Promise<User> {
    try {
      return await apiClient.post<User>('/users', userData);
    } catch (error) {
      throw UsersService.handleError(error);
    }
  }

  /**
   * Update user
   */
  static async update(id: string, userData: Partial<User>): Promise<User> {
    try {
      return await apiClient.put<User>(`/users/${id}`, userData);
    } catch (error) {
      throw UsersService.handleError(error);
    }
  }

  /**
   * Delete user
   */
  static async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.delete<ApiResponse<{ message: string }>>(`/users/${id}`);
    } catch (error) {
      throw UsersService.handleError(error);
    }
  }

  /**
   * Deactivate user
   */
  static async deactivate(id: string): Promise<User> {
    try {
      return await apiClient.post<User>(`/users/${id}/deactivate`);
    } catch (error) {
      throw UsersService.handleError(error);
    }
  }

  /**
   * Activate user
   */
  static async activate(id: string): Promise<User> {
    try {
      return await apiClient.post<User>(`/users/${id}/activate`);
    } catch (error) {
      throw UsersService.handleError(error);
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
      message: 'Users service error',
      error: 'Users Error',
      timestamp: new Date().toISOString(),
      path: '',
    };
  }
}

// Export individual functions for backward compatibility
export const getAllUsers = UsersService.getAll;
export const getUserStatistics = UsersService.getStatistics;
export const getUserById = UsersService.getById;
export const createUser = UsersService.create;
export const updateUser = UsersService.update;
export const deleteUser = UsersService.delete;
export const deactivateUser = UsersService.deactivate;
export const activateUser = UsersService.activate;
