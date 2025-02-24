import { NextFunction, Request, Response } from "express";
import * as UsersService from "../users/users.service";
import * as AuthService from "./auth.service";
import { type CreateUserDto } from "../users/dto";
import { SignInDto } from "./dto";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authRegisterDto: CreateUserDto = req.body;
    await UsersService.createUser(authRegisterDto);
    res.status(201).json({
      message: "User successfully registered!",
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authSignInDto: SignInDto = req.body;
    const token = await AuthService.signIn(authSignInDto);
    res.status(200).json({ token: token });
  } catch (error) {
    next(error);
  }
};
