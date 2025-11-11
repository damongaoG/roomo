export type UserRole = 'looker' | 'lister';

const ROOM_BACKEND_URL = (
  (import.meta.env.VITE_ROOM_BACKEND_URL as string | undefined) ?? ''
).replace(/\/+$/, '');

const USER_PROFILE_API_URL = ROOM_BACKEND_URL
  ? `${ROOM_BACKEND_URL}/api/user-profile`
  : '/api/user-profile';

export interface UserProfile {
  id: string;
  created_at: string;
  user_id: string;
  role: UserRole;
  updated_at: string;
}

export interface PropertyInformation {
  id: number;
  accommodation_type: string | null;
  property_type: string | null;
  bedrooms_number: number | null;
  bathrooms_number: number | null;
  parking: string | null;
  accessibility_features: string | null;
  number_of_people_living: number | null;
  room_name: string | null;
  room_type: string | null;
  room_furnishings: string | null;
  bathroom: string | null;
  bed_size: string | null;
  room_furnishings_features: string | null;
  weekly_rent: number | null;
  bills_included: string | null;
  suburb: string | null;
  room_available_date: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface SearchPreferences {
  created_at?: string;
  max_budget_per_week: number | null;
  min_budget_per_week: number | null;
  move_in_date: string | null;
  suburb: string | null;
  updated_at?: string;
  user_id: string;
}

export interface UserProfilePayload {
  user_profile: UserProfile | null;
  search_preferences: SearchPreferences | null;
  property_information: PropertyInformation | null;
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

  const { user_profile, search_preferences, property_information } =
    payload.data;

  return {
    data: {
      user_profile: user_profile ?? null,
      search_preferences: search_preferences ?? null,
      property_information: property_information ?? null,
    },
  };
};
