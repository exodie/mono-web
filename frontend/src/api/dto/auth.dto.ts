export interface SignInDto {
  email: string;
  password: string;
}

export interface SignUpDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName: string;
  gender: string;
  birthDate: string;
}
