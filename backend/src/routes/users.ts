import { Router, type Request, type Response } from "express";
import { User } from "../model/users";

export const usersRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *           example: Иван Иванов
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-02-16T23:50:21.817Z
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управление пользователями
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Получить всех пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Ошибка сервера
 */
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

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Создать нового пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Созданный пользователь
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Неверные данные
 *       500:
 *         description: Ошибка сервера
 */
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
