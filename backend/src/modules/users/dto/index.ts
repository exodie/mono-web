export interface CreateUserDto {
  username: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'male' | 'female';
  birthDate: string;
  email: string;
  password: string;
}

export type UpdateUserDto = Partial<{
  username: string;
  firstName: string;
  lastName: string;
  middleName: string;
  gender: 'male' | 'female';
  birthDate: string;
  email: string;
  password: string;
}>;
