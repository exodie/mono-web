import { Router } from "express";

import { eventsRouter } from "./events";
import { usersRouter } from "./users";

export const api = Router();

api.use("/events", eventsRouter);
api.use("/users", usersRouter);
