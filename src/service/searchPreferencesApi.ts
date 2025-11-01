import type { SearchPreferences } from './userProfileApi';

const ROOM_BACKEND_URL = (
  (import.meta.env.VITE_ROOM_BACKEND_URL as string | undefined) ?? ''
).replace(/\/+$/, '');

const SEARCH_PREFERENCES_API_URL = ROOM_BACKEND_URL
  ? `${ROOM_BACKEND_URL}/api/search-preferences`
  : '/api/search-preferences';

export interface SearchPreferencesPayload {
  min_budget_per_week: number | null;
  max_budget_per_week: number | null;
  suburb: string | null;
  move_in_date: string | null;
  user_id: string | null;
}

export const extractSearchPreferences = (
  data: unknown
): SearchPreferences | null => {
  if (!data || typeof data !== 'object') return null;

  const candidate = data as Partial<SearchPreferences> & {
    data?: unknown;
    search_preferences?: unknown;
    searchPreferences?: unknown;
  };

  const unwrap = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value[0] ?? null;
    }
    return value ?? null;
  };

  const maybePreference = unwrap(
    candidate.search_preferences ??
      candidate.searchPreferences ??
      candidate.data ??
      candidate
  ) as Partial<SearchPreferences> | null;

  if (!maybePreference || typeof maybePreference !== 'object') return null;

  if (typeof maybePreference.user_id !== 'string') return null;

  return {
    created_at:
      typeof maybePreference.created_at === 'string'
        ? maybePreference.created_at
        : new Date().toISOString(),
    updated_at:
      typeof maybePreference.updated_at === 'string'
        ? maybePreference.updated_at
        : new Date().toISOString(),
    user_id: maybePreference.user_id,
    min_budget_per_week:
      typeof maybePreference.min_budget_per_week === 'number' ||
      maybePreference.min_budget_per_week === null
        ? maybePreference.min_budget_per_week
        : null,
    max_budget_per_week:
      typeof maybePreference.max_budget_per_week === 'number' ||
      maybePreference.max_budget_per_week === null
        ? maybePreference.max_budget_per_week
        : null,
    suburb:
      typeof maybePreference.suburb === 'string'
        ? maybePreference.suburb
        : null,
    move_in_date:
      typeof maybePreference.move_in_date === 'string'
        ? maybePreference.move_in_date
        : null,
  };
};

export const postSearchPreferences = async (
  payload: SearchPreferencesPayload,
  accessToken: string
): Promise<SearchPreferences | null> => {
  if (!accessToken) {
    throw new Error('Missing access token');
  }

  const response = await fetch(SEARCH_PREFERENCES_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const json = (await response.json().catch(() => null)) as unknown;
  return extractSearchPreferences(json);
};
