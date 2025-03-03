import { Router } from 'express';

import { API_SUBSCRIPTIONS } from '@constants/index';
import { eventsRouter, usersRouter } from '@modules/index';

export const api = Router();

api.get('/', (_, res) => {
  res.status(200).send();
});

api.use(API_SUBSCRIPTIONS.EVENTS, eventsRouter);
api.use(API_SUBSCRIPTIONS.USERS, usersRouter);
