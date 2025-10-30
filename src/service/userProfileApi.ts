export type UserRole = 'looker' | 'lister';

const USER_PROFILE_API_URL =
  'https://room-backend-node-neq2.vercel.app/api/user-profile';

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
  })
}
