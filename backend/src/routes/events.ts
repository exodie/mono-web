import { Router, type Request, type Response } from "express";
import { Op } from "@sequelize/core";
import { Event, User } from "../model";

export const eventsRouter = Router();

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

    const event = await Event.create({
      title,
      description: description ?? null,
      date,
      createdBy,
    });

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

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
