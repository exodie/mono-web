import { User } from '@model';
import { hash } from 'bcryptjs';

import type { CreateUserDto, UpdateUserDto } from './dto';

export const getAllUsers = async () => {
  return User.findAll({
    attributes: ['id', 'username', 'email', 'createdAt'],
  });
};

export const createUser = async (createUserDto: CreateUserDto) => {
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    middleName,
    gender,
    birthDate,
  } = createUserDto;

  if (
    !username ||
    !email ||
    !password ||
    !firstName ||
    !lastName ||
    !gender ||
    !birthDate
  ) {
    throw new Error('Required fields are missing');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await hash(password, 10);

  return User.create({
    username,
    firstName,
    lastName,
    middleName,
    gender,
    birthDate,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });
};

export const getUserById = async (id: number) => {
  const user = await User.findOne({
    where: { id },
    attributes: [
      'id',
      'username',
      'email',
      'createdAt',
      'firstName',
      'lastName',
      'middleName',
      'gender',
      'birthDate',
    ],
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const updateUser = async (
  userId: number,
  updateUserDto: UpdateUserDto,
) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const { email, password, ...restData } = updateUserDto;

  // Если меняется email, проверяем его уникальность
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser && existingUser.id !== userId) {
      throw new Error('Email already exists');
    }
  }

  // Если меняется пароль, хешируем его
  const updates: Partial<UpdateUserDto> = { ...restData };
  if (password) {
    updates.password = await hash(password, 10);
  }
  if (email) {
    updates.email = email;
  }

  await user.update(updates);
  return user;
};
