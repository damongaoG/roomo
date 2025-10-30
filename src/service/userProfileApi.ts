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

export interface UserProfileResponse {
  data: UserProfile | null;
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

  const payload = (await response.json()) as UserProfileResponse;
  if (!('data' in payload)) {
    return { data: null };
  }

  return payload;
};
