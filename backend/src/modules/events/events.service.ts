import { Op } from "@sequelize/core";
import { Event, User } from "../../model";
import { CreateEventDto, UpdateEventDto } from "./dto";

export const getAllEvents = async (searchQuery?: string) => {
  const whereCondition = searchQuery
    ? {
        [Op.or]: [
          { title: { [Op.iLike]: `%${searchQuery}%` } },
          { description: { [Op.iLike]: `%${searchQuery}%` } },
        ],
      }
    : {};

  return Event.findAll({ where: whereCondition });
};

export const getEventById = async (id: number) => {
  const event = await Event.findByPk(id);

  if (!event) throw new Error("Event not found");

  return event;
};

export const createEvent = async (
  createEventDto: CreateEventDto
): Promise<Event> => {
  const user = await User.findByPk(createEventDto.createdBy);
  if (!user) throw new Error("User not found");

  // Step: Проверка на дневной лимит создания ивентов
  const DAILY_EVENT_LIMIT = parseInt(process.env.DAILY_EVENT_LIMIT || "5", 10);
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const eventCount = await Event.count({
    where: {
      createdBy: createEventDto.createdBy,
      createdAt: { [Op.gte]: twentyFourHoursAgo },
    },
  });

  if (eventCount >= DAILY_EVENT_LIMIT) {
    throw new Error(
      `Daily event limit exceeded (max ${DAILY_EVENT_LIMIT} per day)`
    );
  }

  return Event.create({
    createEventDto,
    createdAt: new Date(),
  });
};

export const updateEvent = async (
  id: number,
  updates: UpdateEventDto
): Promise<Event> => {
  const event = await getEventById(id);

  if (updates.title?.trim().length === 0) {
    throw new Error("Title cannot be empty");
  }

  return event.update(updates);
};

export const deleteEvent = async (id: number): Promise<void> => {
  const event = await getEventById(id);
  await event.destroy();
};
