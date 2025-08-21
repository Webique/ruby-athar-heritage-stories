// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ruby-athar-heritage-stories.onrender.com/api';

// Types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  language: 'en' | 'ar';
}

export interface BookingFormData {
  name: string;
  phone: string;
  email: string;
  age?: string;
  date: string;
  package: string;
  participants: string;
  addOns: string[];
  tripTitle: string;
  language: string;
  totalPrice: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// API Client
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('API Client - Request URL:', url);
    console.log('API Client - Request options:', options);
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    console.log('API Client - Stored token:', token ? `${token.substring(0, 20)}...` : 'No token found');
    
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
      console.log('API Client - Added Authorization header');
    } else {
      console.log('API Client - No token available, skipping Authorization header');
    }

    try {
      console.log('API Client - Making fetch request to:', url);
      console.log('API Client - Final config:', config);
      const response = await fetch(url, config);
      console.log('API Client - Response status:', response.status);
      console.log('API Client - Response headers:', response.headers);
      
      const data = await response.json();
      console.log('API Client - Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: any }>> {
    console.log('API Client - Login called with:', credentials);
    console.log('API Client - Base URL:', this.baseURL);
    console.log('API Client - Full URL:', `${this.baseURL}/auth/login`);
    
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Contact form
  async submitContact(data: ContactFormData): Promise<ApiResponse> {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Booking form
  async submitBooking(data: BookingFormData): Promise<ApiResponse<{ bookingId: string }>> {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin routes
  async getBookings(): Promise<ApiResponse<any[]>> {
    return this.request('/admin/bookings');
  }

  async getContacts(): Promise<ApiResponse<any[]>> {
    return this.request('/admin/contacts');
  }

  async updateBookingStatus(id: string, status: string): Promise<ApiResponse> {
    return this.request(`/admin/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Delete methods
  async deleteBooking(id: string): Promise<ApiResponse> {
    return this.request(`/admin/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteContact(id: string): Promise<ApiResponse> {
    return this.request(`/admin/contacts/${id}`, {
      method: 'DELETE',
    });
  }

  // File upload
  async uploadFile(file: File): Promise<ApiResponse<{ filename: string; path: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseURL}/upload`;
    const token = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Utility functions
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

export const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string): void => {
  console.log('setAuthToken called with:', token ? `${token.substring(0, 20)}...` : 'No token');
  localStorage.setItem('authToken', token);
  console.log('Token stored in localStorage. Current token:', localStorage.getItem('authToken') ? 'Token exists' : 'No token');
};

export const setUser = (user: any): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): any => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
