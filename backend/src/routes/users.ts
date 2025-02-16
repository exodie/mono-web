import { Router, type Request, type Response } from "express";
import { User } from "../model/users";

export const usersRouter = Router();

usersRouter.get("/", async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "createdAt"],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

usersRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      res.status(400).json({ message: "Name and email are required" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const user = await User.create({
      name,
      email,
      createdAt: new Date(),
    });

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
