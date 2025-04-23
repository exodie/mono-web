type FormFieldProps = {
  value: string;
  isError?: boolean;
};

export type SignInFormProps = {
  email: FormFieldProps;
  password: FormFieldProps;
};

export type SignUpFormProps = {
  email: FormFieldProps;
  password: FormFieldProps;
  repeatPassword: FormFieldProps;
};

export interface SignUpDto {
  username: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'male' | 'female';
  birthDate: string;
  email: string;
  password: string;
}

export interface UpdateProfileDto {
  username?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string | null;
  gender?: 'male' | 'female';
  birthDate?: string;
  email?: string;
  password?: string;
}

export interface SignInDto {
  email: string;
  password: string;
}
