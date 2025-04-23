import {
  Button,
  Form,
  DatePicker,
  Input,
  message,
  Typography,
  Radio,
} from 'antd';
import { Link, useNavigate } from 'react-router';
import dayjs from 'dayjs';
import { signUp } from '@/api';
import type { SignUpDto } from '@/types/auth';
import styles from './index.module.scss';

type FieldType = Partial<SignUpDto>;

export const SignUp = () => {
  const navigate = useNavigate();

  const onFinishFailed = (errorInfo: {
    errorFields: { errors: string[] }[];
  }) => {
    message.error(errorInfo.errorFields[0].errors[0]);
  };

  const onFinish = async (values: FieldType) => {
    if (
      !values.username ||
      !values.email ||
      !values.password ||
      !values.firstName ||
      !values.lastName ||
      !values.gender ||
      !values.birthDate
    ) {
      return;
    }

    const response = await signUp({
      username: values.username,
      firstName: values.firstName,
      lastName: values.lastName,
      middleName: values.middleName || '',
      gender: values.gender,
      birthDate: values.birthDate,
      email: values.email,
      password: values.password,
    });

    if (response?.error) {
      message.error(response.error.message);
      return;
    }

    message.success('Регистрация прошла успешно');
    navigate('/auth/in');
  };

  return (
    <Form
      className={styles.form}
      name="signup"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Typography.Title level={2}>Регистрация</Typography.Title>

      <Form.Item<FieldType>
        label="Имя пользователя"
        name="username"
        rules={[
          { required: true, message: 'Введите имя пользователя!' },
          { min: 2, message: 'Минимум 2 символа!' },
          { max: 50, message: 'Максимум 50 символов!' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Имя"
        name="firstName"
        rules={[
          { required: true, message: 'Введите имя!' },
          { min: 2, message: 'Минимум 2 символа!' },
          { max: 50, message: 'Максимум 50 символов!' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Фамилия"
        name="lastName"
        rules={[
          { required: true, message: 'Введите фамилию!' },
          { min: 2, message: 'Минимум 2 символа!' },
          { max: 50, message: 'Максимум 50 символов!' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Отчество"
        name="middleName"
        rules={[
          { min: 2, message: 'Минимум 2 символа!' },
          { max: 50, message: 'Максимум 50 символов!' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Пол"
        name="gender"
        rules={[{ required: true, message: 'Выберите пол!' }]}
      >
        <Radio.Group>
          <Radio value="male">Мужской</Radio>
          <Radio value="female">Женский</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item<FieldType>
        label="Дата рождения"
        name="birthDate"
        rules={[
          { required: true, message: 'Выберите дату рождения!' },
          {
            validator: (_, value) => {
              if (!value) return Promise.resolve();
              const date = dayjs(value);
              if (date.isAfter(dayjs())) {
                return Promise.reject('Дата рождения не может быть в будущем!');
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <DatePicker format="YYYY-MM-DD" />
      </Form.Item>

      <Form.Item<FieldType>
        label="Почта"
        name="email"
        rules={[
          { required: true, message: 'Введите почту!' },
          { type: 'email', message: 'Введите корректный email!' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Пароль"
        name="password"
        rules={[
          { required: true, message: 'Введите пароль!' },
          { min: 8, message: 'Минимум 8 символов!' },
          { max: 60, message: 'Максимум 60 символов!' },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Зарегистрироваться
        </Button>
      </Form.Item>

      <div className={styles.register}>
        <Typography.Text>Есть аккаунт?</Typography.Text>
        <Link to="/auth/in">
          <Button>Войти</Button>
        </Link>
      </div>
    </Form>
  );
};
