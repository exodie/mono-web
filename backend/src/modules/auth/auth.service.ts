import { compare } from "bcryptjs";
import { User } from "../../model";
import { createJwtToken } from "../../shared/utils";
import { SignInDto } from "./dto";

export const signIn = async (signInDto: SignInDto) => {
  const { email, password } = signInDto;

  if (!email || !password) throw new Error("Email and password are required.");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  return createJwtToken(user.id);
};
