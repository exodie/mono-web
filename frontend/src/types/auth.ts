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
