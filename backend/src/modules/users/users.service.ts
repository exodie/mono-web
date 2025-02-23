import { User } from "../../model/users";
import { CreateUserDto } from "./dto";

export const getAllUsers = async () => {
  return User.findAll({
    attributes: ["id", "name", "email", "createdAt"],
  });
};

export const createUser = async (createUserDto: CreateUserDto) => {
  const { name, email } = createUserDto;

  if (!name || !email) {
    throw new Error("Name and email are required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  return User.create({
    name,
    email,
    createdAt: new Date(),
  });
};
