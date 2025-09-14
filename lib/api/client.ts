
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { ErrorResponse, AuthResponse } from '@/types/api';

// API Client Configuration
interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

class ApiClient {
  private instance: AxiosInstance;
  private config: ApiClientConfig;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    this.config = {
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
    };

    this.instance = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
  headers: {
    'Content-Type': 'application/json',
        'Accept': 'application/json',
  },
});

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
  (config) => {
        // Add auth token if available
        const token = this.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

        // Add request timestamp for debugging
        config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
        return Promise.reject(this.handleError(error));
  }
);

    // Response interceptor
    this.instance.interceptors.response.use(
  (response) => {
        // Log response time for debugging
        if (response.config.metadata?.startTime) {
          const endTime = new Date();
          const duration = endTime.getTime() - response.config.metadata.startTime.getTime();
          console.log(`API Request to ${response.config.url} took ${duration}ms`);
        }

    return response;
  },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle 401 errors with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(() => {
              return this.instance(originalRequest);
            }).catch((err) => {
              return Promise.reject(err);
            });
          }

      originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshToken();
            this.setAccessToken(newToken);
            
            // Process queued requests
            this.processQueue(null);
            
            // Retry original request
            return this.instance(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError);
            this.clearTokens();
            this.redirectToLogin();
            return Promise.reject(this.handleError(refreshError));
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private processQueue(error: any): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
    
    this.failedQueue = [];
  }

  private async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${this.config.baseURL}/auth/refresh`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    
    // Update refresh token if provided
    if (newRefreshToken) {
      this.setRefreshToken(newRefreshToken);
    }

    return accessToken;
  }

  private handleError(error: AxiosError): ErrorResponse {
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data as ErrorResponse;
      return {
        statusCode: error.response.status,
        message: errorData?.message || 'An error occurred',
        error: errorData?.error || 'Unknown Error',
        timestamp: new Date().toISOString(),
        path: error.config?.url || '',
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        statusCode: 0,
        message: 'Network error - please check your connection',
        error: 'Network Error',
        timestamp: new Date().toISOString(),
        path: error.config?.url || '',
      };
    } else {
      // Something else happened
      return {
        statusCode: 500,
        message: error.message || 'An unexpected error occurred',
        error: 'Client Error',
        timestamp: new Date().toISOString(),
        path: error.config?.url || '',
      };
    }
  }

  // Token management methods
  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  private setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  private setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('refreshToken', token);
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  private redirectToLogin(): void {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth';
    }
  }

  // Public methods for making requests
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }

  // File upload method
  async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    };

    return this.post<T>(url, formData, config);
  }

  // Batch request method
  async batch<T>(requests: Array<() => Promise<T>>): Promise<T[]> {
    return Promise.all(requests.map(request => request()));
  }

  // Retry mechanism for failed requests
  async withRetry<T>(request: () => Promise<T>, attempts = this.config.retryAttempts): Promise<T> {
    let lastError: any;

    for (let i = 0; i < attempts; i++) {
      try {
        return await request();
      } catch (error) {
        lastError = error;
        
        // Don't retry on 4xx errors (except 429 - rate limit)
        if (error.response?.status >= 400 && error.response?.status < 500 && error.response?.status !== 429) {
          throw error;
        }

        // Wait before retrying
        if (i < attempts - 1) {
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * Math.pow(2, i)));
        }
      }
    }

    throw lastError;
  }

  // Authentication methods
  setAuthTokens(accessToken: string, refreshToken: string): void {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  clearAuth(): void {
    this.clearTokens();
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  // Configuration methods
  updateConfig(newConfig: Partial<ApiClientConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.instance.defaults.baseURL = this.config.baseURL;
    this.instance.defaults.timeout = this.config.timeout;
  }

  getConfig(): ApiClientConfig {
    return { ...this.config };
  }
}

// Create and export singleton instance
const apiClient = new ApiClient();
export default apiClient;

// Export the class for testing purposes
export { ApiClient };
