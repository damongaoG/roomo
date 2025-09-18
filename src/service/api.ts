import { useTokenManager } from '../utils/tokenManager';
import { useHistory } from 'react-router';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface SetUserRoleResponse<T = any> {
  success: boolean;
  message: string;
  userId: string;
  role: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export const useApiService = () => {
  const { getIdToken, secureLogout } = useTokenManager();
  const history = useHistory();

  const makeRequest = async <T>(
    endPoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const token = await getIdToken();

      const response = await fetch(`${API_BASE_URL}${endPoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      });

      // Global 401 handling: log out and route to login entry
      if (response.status === 401) {
        try {
          await secureLogout();
        } catch (e) {
          // fall through to local navigation if logout fails
        }
        try {
          history.replace('/');
        } catch (e) {
          // no-op: navigation best-effort
        }
        return {
          success: false,
          error: 'Unauthorized',
        };
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const setUserRole = async (
    role: 'looker' | 'lister'
  ): Promise<ApiResponse<SetUserRoleResponse>> => {
    return makeRequest<SetUserRoleResponse>('/api/users/role', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  };

  return {
    setUserRole,
  };
};
