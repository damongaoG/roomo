import { useHistory } from 'react-router';
import { supabase } from './supabaseClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface SetUserRoleResponse<T = unknown> {
  success: boolean;
  message: string;
  userId: string;
  role: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UserInfoResponse {
  id: number;
  auth0UserId: string;
  email: string;
  name: string;
  pictureUrl?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  registrationStep?: string;
}

export const useApiService = () => {
  const history = useHistory();

  const makeRequest = async <T>(
    endPoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    try {
      const sessionResult = await supabase.auth.getSession();
      const accessToken = sessionResult.data.session?.access_token;

      const response = await fetch(`${API_BASE_URL}${endPoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          ...options.headers,
        },
        ...options,
      });

      // Global 401 handling: log out and route to login entry
      if (response.status === 401) {
        try {
          await supabase.auth.signOut();
        } catch {
          // fall through to local navigation if logout fails
        }
        try {
          history.replace('/');
        } catch {
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

      const json = (await response.json()) as T;
      return { success: true, data: json };
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
