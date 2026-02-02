// API Client for Run Run Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://zippy-healing-production-24e4.up.railway.app';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || 'Erro desconhecido',
        };
      }
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }

  // Admin: Get all withdrawal requests
  async getWithdrawals() {
    return this.request(`/api/admin/withdrawals`, {
      headers: { 'x-admin-key': 'runrun-admin-2025' },
    });
  }

  async getDashboardStats() {
    return this.request('/api/admin/dashboard', {
      headers: { 'x-admin-key': 'runrun-admin-2025' },
    });
  }

  async getUsers(page = 1, limit = 10) {
    return this.request(`/api/admin/users?page=${page}&limit=${limit}`, {
      headers: { 'x-admin-key': 'runrun-admin-2025' },
    });
  }

  async getPassengers(page = 1, limit = 100) {
    return this.request(`/api/admin/passengers?page=${page}&limit=${limit}`, {
      headers: { 'x-admin-key': 'runrun-admin-2025' },
    });
  }

  async getDrivers(page = 1, limit = 100) {
    return this.request(`/api/admin/drivers?page=${page}&limit=${limit}`, {
      headers: { 'x-admin-key': 'runrun-admin-2025' },
    });
  }

  async activateDriver(driverId: number, data: { verifiedBy: string; notes?: string }) {
    return this.request(`/api/admin/drivers/activate/${driverId}`, {
      method: 'POST',
      headers: { 'x-admin-key': 'runrun-admin-2025' },
      body: JSON.stringify(data),
    });
  }

  async deactivateDriver(driverId: number, reason: string) {
    return this.request(`/api/admin/drivers/deactivate/${driverId}`, {
      method: 'POST',
      headers: { 'x-admin-key': 'runrun-admin-2025' },
      body: JSON.stringify({ reason }),
    });
  }

  async rejectDriver(driverId: number, reason: string) {
    return this.request(`/api/admin/drivers/reject/${driverId}`, {
      method: 'POST',
      headers: { 'x-admin-key': 'runrun-admin-2025' },
      body: JSON.stringify({ reason }),
    });
  }

  async sendMessage(userId: number, userType: 'driver' | 'passenger', message: string, subject?: string) {
    return this.request('/api/admin/messages/send', {
      method: 'POST',
      headers: { 'x-admin-key': 'runrun-admin-2025' },
      body: JSON.stringify({ userId, userType, message, subject }),
    });
  }

  async getRides(page = 1, limit = 10, status?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) params.append('status', status);
    return this.request(`/api/admin/rides?${params}`, {
      headers: { 'x-admin-key': 'runrun-admin-2025' },
    });
  }

  async getSupportTickets() {
    return this.request('/api/admin/support', {
      headers: { 'x-admin-key': 'runrun-admin-2025' },
    });
  }

  // Public endpoints (for driver registration, etc.)
  async registerDriver(data: FormData) {
    try {
      const response = await fetch(`${this.baseUrl}/api/drivers/register`, {
        method: 'POST',
        body: data, // FormData for file uploads
      });
      const result = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: result.error || result.message || 'Erro no registro',
        };
      }
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Driver Registration Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }

  async submitContactForm(data: { name: string; email: string; phone: string; message: string }) {
    return this.request('/api/contact/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export { API_BASE_URL };