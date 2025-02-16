import { Router, type Request, type Response } from "express";
import { Op } from "@sequelize/core";
import { Event, User } from "../model";

export const eventsRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - date
 *         - createdBy
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           example: Концерт группы
 *         description:
 *           type: string
 *           example: Описание мероприятия
 *         date:
 *           type: string
 *           format: date-time
 *           example: 2025-02-16T23:50:21.817Z
 *         createdBy:
 *           type: integer
 *           example: 1
 */

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Управление мероприятиями
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Получить все мероприятия
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Поиск по названию и описанию
 *     responses:
 *       200:
 *         description: Список мероприятий
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Ошибка сервера
 */
eventsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.search as string;

    const whereCondition = searchQuery
      ? {
          [Op.or]: [
            { title: { [Op.iLike]: `%${searchQuery}%` } },
            { description: { [Op.iLike]: `%${searchQuery}%` } },
          ],
        }
      : {};

    const events = await Event.findAll({
      where: whereCondition,
    });

    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Получить мероприятие по ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Данные мероприятия
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */
eventsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Создать новое мероприятие
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Созданное мероприятие
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Неверные данные
 *       429:
 *         description: Превышен дневной лимит мероприятий
 *         content:
 *           application/json:
 *             example:
 *               message: "Дневной лимит на создание ивентов превышен (не более 5 шт. в сутки)"
 *       500:
 *         description: Ошибка сервера
 */
eventsRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { title, description, date, createdBy } = req.body;

    if (!title || !date || !createdBy) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const user = await User.findByPk(createdBy);
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    // Number тож не плохо смотрится, но парсить надежней как кажется
    const DAILY_EVENT_LIMIT = parseInt(
      process.env.DAILY_EVENT_LIMIT || "5",
      10
    );

    if (isNaN(DAILY_EVENT_LIMIT)) {
      console.error("Invalid DAILY_EVENT_LIMIT in .env, using default value 5");

      throw new Error();
    }

    // TODO: Tests
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const eventCount = await Event.count({
      where: {
        createdBy,
        createdAt: {
          [Op.gte]: twentyFourHoursAgo,
        },
      },
    });

    if (eventCount >= DAILY_EVENT_LIMIT) {
      res.status(429).json({
        message: `Дневной лимит на создание ивентов превышен (не более ${DAILY_EVENT_LIMIT} шт. в сутки)`,
      });

      return;
    }

    const event = await Event.create({
      title,
      description: description ?? null,
      date,
      createdBy,
      createdAt: new Date()
    });

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Обновить мероприятие
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Обновленные данные
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Неверные данные
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */
eventsRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const { title, description, date } = req.body;
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    if (!title && !description && !date) {
      return;
    }

    if (title && title.trim().length === 0) {
      res.status(400).json({ message: "Title cannot be empty" });
      return;
    }

    await event.update({
      title: title || event.title,
      description: description !== undefined ? description : event.description,
      date: date || event.date,
    });

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Удалить мероприятие
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Мероприятие удалено
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */
eventsRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    await event.destroy();
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
