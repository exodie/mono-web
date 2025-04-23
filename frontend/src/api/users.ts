import { User } from '@/types';
import { apiBasis } from '@/constants/apis';

import { UpdateProfileDto } from './dto';

interface AuthError {
  status: number;
  message: string;
}

interface AuthResponse<T> {
  data?: T;
  error?: AuthError;
}

export const fetchUserData = async (): Promise<User> => {
  return apiBasis.get('users/whoami').json<User>();
};

export const updateProfile = async (
  updateProfileDto: UpdateProfileDto,
): Promise<AuthResponse<void>> => {
  try {
    await apiBasis.put('users/profile', { json: updateProfileDto }).json();
    return {};
  } catch (error: unknown) {
    const err = error as { response?: { status: number; message: string } };
    return {
      error: {
        status: err?.response?.status || 500,
        message:
          err?.response?.message || 'Произошла ошибка при обновлении профиля',
      },
    };
  }
};
