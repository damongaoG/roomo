export type UserRole = 'looker' | 'lister';

const USER_PROFILE_API_URL =
  'https://room-backend-node-neq2.vercel.app/api/user-profile';

export interface UserProfile {
  id: string;
  created_at: string;
  user_id: string;
  role: UserRole;
  updated_at: string;
}

export interface SearchPreferences {
  created_at: string;
  max_budget_per_week: number | null;
  min_budget_per_week: number | null;
  move_in_date: string | null;
  suburb: string | null;
  updated_at: string;
  user_id: string;
}

export interface UserProfilePayload {
  user_profile: UserProfile | null;
  search_preferences: SearchPreferences | null;
}

export interface UserProfileResponse {
  data: UserProfilePayload | null;
}

interface PostUserRoleParams {
  userId: string;
  role: UserRole;
  accessToken: string;
}

export const postUserRole = async ({
  userId,
  role,
  accessToken,
}: PostUserRoleParams): Promise<Response> => {
  return await fetch(USER_PROFILE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      user_id: userId,
      role,
    }),
  });
};

export const getCurrentUserProfile = async (
  accessToken: string
): Promise<UserProfileResponse> => {
  const response = await fetch(`${USER_PROFILE_API_URL}/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.warn('[UserProfileApi] Failed to fetch current profile', {
      status: response.status,
      statusText: response.statusText,
    });
    return { data: null };
  }

  const payload = (await response.json()) as Partial<UserProfileResponse>;
  if (!payload || typeof payload !== 'object' || !('data' in payload)) {
    return { data: null };
  }

  if (!payload.data) {
    return { data: null };
  }

  const { user_profile, search_preferences } = payload.data;

  return {
    data: {
      user_profile: user_profile ?? null,
      search_preferences: search_preferences ?? null,
    },
  };
};
