import { Router } from "express";
import { getAllEvents } from "../../../modules/events/events.controller";
import { authRouter } from "../../../modules/auth/auth.routes";
import { API_SUBSCRIPTIONS } from "../../../shared/constants";

export const publicRouter = Router();

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
publicRouter.get("/events", getAllEvents);

publicRouter.use(API_SUBSCRIPTIONS.AUTH, authRouter);