
import apiClient from './client';
import {
  Space,
  CreateSpaceRequest,
  UpdateSpaceRequest,
  SpaceSearchFilters,
  SpaceAnalytics,
  ApiResponse,
  PaginatedResponse,
  ErrorResponse,
} from '@/types/api';

export class SpacesService {
  /**
   * Get all spaces with optional filters
   */
  static async getSpaces(filters?: SpaceSearchFilters): Promise<PaginatedResponse<Space>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => params.append(key, v.toString()));
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }

      return await apiClient.get<PaginatedResponse<Space>>(`/spaces?${params.toString()}`);
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Get space by ID
   */
  static async getSpace(id: string): Promise<Space> {
    try {
      return await apiClient.get<Space>(`/spaces/${id}`);
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Search spaces with advanced filters
   */
  static async searchSpaces(filters: SpaceSearchFilters): Promise<PaginatedResponse<Space>> {
    try {
      return await apiClient.post<PaginatedResponse<Space>>('/spaces/search', filters);
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Get featured spaces
   */
  static async getFeaturedSpaces(limit = 10): Promise<Space[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<Space>>(`/spaces/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Get spaces by category
   */
  static async getSpacesByCategory(category: string, limit = 20): Promise<Space[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<Space>>(`/spaces/category/${category}?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Get spaces by location
   */
  static async getSpacesByLocation(city: string, state?: string): Promise<Space[]> {
    try {
      const params = new URLSearchParams({ city });
      if (state) params.append('state', state);
      
      const response = await apiClient.get<PaginatedResponse<Space>>(`/spaces/location?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Get nearby spaces
   */
  static async getNearbySpaces(lat: number, lng: number, radius = 10): Promise<Space[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<Space>>(
        `/spaces/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
      );
      return response.data;
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Create new space (for brand owners)
   */
  static async createSpace(spaceData: CreateSpaceRequest): Promise<Space> {
    try {
      return await apiClient.post<Space>('/spaces', spaceData);
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Update space (for brand owners)
   */
  static async updateSpace(id: string, spaceData: Partial<UpdateSpaceRequest>): Promise<Space> {
    try {
      return await apiClient.patch<Space>(`/spaces/${id}`, spaceData);
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Delete space (for brand owners)
   */
  static async deleteSpace(id: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.delete<ApiResponse<{ message: string }>>(`/spaces/${id}`);
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Get spaces owned by current user
   */
  static async getMySpaces(): Promise<Space[]> {
    try {
      const response = await apiClient.get<PaginatedResponse<Space>>('/spaces/my');
      return response.data;
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Upload space images
   */
  static async uploadSpaceImages(spaceId: string, files: File[]): Promise<ApiResponse<{ images: string[] }>> {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      return await apiClient.post<ApiResponse<{ images: string[] }>>(
        `/spaces/${spaceId}/images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Delete space image
   */
  static async deleteSpaceImage(spaceId: string, imageUrl: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.delete<ApiResponse<{ message: string }>>(`/spaces/${spaceId}/images`, {
        data: { imageUrl },
      });
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Toggle space active status
   */
  static async toggleSpaceStatus(spaceId: string, isActive: boolean): Promise<Space> {
    try {
      return await apiClient.patch<Space>(`/spaces/${spaceId}/status`, { isActive });
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Toggle space featured status (admin only)
   */
  static async toggleFeaturedStatus(spaceId: string, isFeatured: boolean): Promise<Space> {
    try {
      return await apiClient.patch<Space>(`/spaces/${spaceId}/featured`, { isFeatured });
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Get space analytics
   */
  static async getSpaceAnalytics(spaceId: string, period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<SpaceAnalytics> {
    try {
      return await apiClient.get<SpaceAnalytics>(`/spaces/${spaceId}/analytics?period=${period}`);
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Get space availability for a date
   */
  static async getSpaceAvailability(spaceId: string, date: string): Promise<ApiResponse<{ available: boolean; slots: string[] }>> {
    try {
      return await apiClient.get<ApiResponse<{ available: boolean; slots: string[] }>>(
        `/spaces/${spaceId}/availability?date=${date}`
      );
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Check space availability for specific time slot
   */
  static async checkAvailability(spaceId: string, date: string, startTime: string, endTime: string): Promise<ApiResponse<{ available: boolean; conflicts?: any[] }>> {
    try {
      return await apiClient.post<ApiResponse<{ available: boolean; conflicts?: any[] }>>(
        `/spaces/${spaceId}/check-availability`,
        { date, startTime, endTime }
      );
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Get space reviews
   */
  static async getSpaceReviews(spaceId: string, page = 1, limit = 10): Promise<PaginatedResponse<any>> {
    try {
      return await apiClient.get<PaginatedResponse<any>>(`/spaces/${spaceId}/reviews?page=${page}&limit=${limit}`);
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Add space review
   */
  static async addSpaceReview(spaceId: string, rating: number, comment: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await apiClient.post<ApiResponse<{ message: string }>>(`/spaces/${spaceId}/reviews`, {
        rating,
        comment,
      });
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Get space pricing details
   */
  static async getSpacePricing(spaceId: string, date: string, startTime: string, endTime: string): Promise<ApiResponse<{ totalAmount: number; breakdown: any }>> {
    try {
      return await apiClient.post<ApiResponse<{ totalAmount: number; breakdown: any }>>(
        `/spaces/${spaceId}/pricing`,
        { date, startTime, endTime }
      );
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Get popular amenities
   */
  static async getPopularAmenities(): Promise<ApiResponse<{ amenity: string; count: number }[]>> {
    try {
      return await apiClient.get<ApiResponse<{ amenity: string; count: number }[]>>('/spaces/amenities/popular');
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Get all available amenities
   */
  static async getAllAmenities(): Promise<ApiResponse<string[]>> {
    try {
      return await apiClient.get<ApiResponse<string[]>>('/spaces/amenities');
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Get space categories
   */
  static async getCategories(): Promise<ApiResponse<string[]>> {
    try {
      return await apiClient.get<ApiResponse<string[]>>('/spaces/categories');
    } catch (error) {
      throw SpacesService.handleError(error);
    }
  }

  /**
   * Get space statistics
   */
  static async getSpaceStats(): Promise<ApiResponse<{ total: number; active: number; featured: number; categories: Record<string, number> }>> {
    try {
      return await apiClient.get<ApiResponse<{ total: number; active: number; featured: number; categories: Record<string, number> }>>('/spaces/stats');
    } catch (error) {
      throw SpacesService.handleError(error);
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
      message: 'Spaces service error',
      error: 'Spaces Error',
      timestamp: new Date().toISOString(),
      path: '',
    };
  }
}

// Export individual functions for backward compatibility
export const getSpaces = SpacesService.getSpaces;
export const getSpace = SpacesService.getSpace;
export const searchSpaces = SpacesService.searchSpaces;
export const getFeaturedSpaces = SpacesService.getFeaturedSpaces;
export const getSpacesByCategory = SpacesService.getSpacesByCategory;
export const getSpacesByLocation = SpacesService.getSpacesByLocation;
export const getNearbySpaces = SpacesService.getNearbySpaces;
export const createSpace = SpacesService.createSpace;
export const updateSpace = SpacesService.updateSpace;
export const deleteSpace = SpacesService.deleteSpace;
export const getMySpaces = SpacesService.getMySpaces;
export const uploadSpaceImages = SpacesService.uploadSpaceImages;
export const deleteSpaceImage = SpacesService.deleteSpaceImage;
export const toggleSpaceStatus = SpacesService.toggleSpaceStatus;
export const toggleFeaturedStatus = SpacesService.toggleFeaturedStatus;
export const getSpaceAnalytics = SpacesService.getSpaceAnalytics;
export const getSpaceAvailability = SpacesService.getSpaceAvailability;
export const checkAvailability = SpacesService.checkAvailability;
export const getSpaceReviews = SpacesService.getSpaceReviews;
export const addSpaceReview = SpacesService.addSpaceReview;
export const getSpacePricing = SpacesService.getSpacePricing;
export const getPopularAmenities = SpacesService.getPopularAmenities;
export const getAllAmenities = SpacesService.getAllAmenities;
export const getCategories = SpacesService.getCategories;
export const getSpaceStats = SpacesService.getSpaceStats;
