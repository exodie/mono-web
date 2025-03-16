import { apiBasis } from '@/constants';

import { SignInDto, SignUpDto } from './dto';

interface AuthError {
  status: number;
  message: string;
}

interface AuthResponse<T> {
  data?: T;
  error?: AuthError;
}

export const signIn = async (
  signInDto: SignInDto,
): Promise<AuthResponse<{ token: string }>> => {
  try {
    const data = await apiBasis
      .post('auth/login', { json: signInDto })
      .json<{ token: string }>();
    return { data };
  } catch (error: unknown) {
    const err = error as { response?: { status: number; message: string } };
    return {
      error: {
        status: err?.response?.status || 500,
        message: err?.response?.message || 'Произошла ошибка при входе',
      },
    };
  }
};

export const signUp = async (
  signUpDto: SignUpDto,
): Promise<AuthResponse<void> | undefined> => {
  try {
    await apiBasis.post('auth/register', { json: signUpDto }).json();
  } catch (error: unknown) {
    const err = error as { response?: { status: number; message: string } };
    return {
      error: {
        status: err?.response?.status || 500,
        message: err?.response?.message || 'Произошла ошибка при регистрации',
      },
    };
  }
};
