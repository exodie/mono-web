import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import * as UsersService from './users.service';
import type { UpdateUserDto } from './dto';
import { User } from '../../model';

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await UsersService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await UsersService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
    };

    const user = await UsersService.getUserById(decoded.id);
    res.json(user);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    next(error);
  }
};

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await UsersService.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await UsersService.getUserById(Number(req.params.id));
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req.user as { id: number }).id;
    const updateData: UpdateUserDto = req.body;

    const updatedUser = await User.findByPk(userId);
    if (!updatedUser) {
      throw new Error('User not found');
    }

    await updatedUser.update(updateData);

    // Исключаем пароль из ответа
    const { password, ...userWithoutPassword } = updatedUser.toJSON();

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};
