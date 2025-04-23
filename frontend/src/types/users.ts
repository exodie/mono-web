export interface UserState {
  data: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'male' | 'female';
  birthDate: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: 'male' | 'female';
  birthDate?: string;
}
