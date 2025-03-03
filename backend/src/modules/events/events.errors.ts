import { createErrorMiddleware } from '@utils/index';
import type { ErrorMaps } from '@sharedTypes/index';

// Живет до перехода на Nest
const errorMap: ErrorMaps = [
  [
    (error) => error.message === 'User not found',
    { status: 404, message: 'User not found' },
  ],
  [
    (error) => error.message.startsWith('Daily event limit exceeded'),
    { status: 429, message: 'Daily event limit exceeded' },
  ],
  [
    (error) => error.message === 'Title cannot be empty',
    { status: 400, message: 'Title cannot be empty' },
  ],
  [
    (error) => error.message === 'Event not found',
    { status: 404, message: 'Event not found' },
  ],
];

export const validateErrors = createErrorMiddleware(errorMap);
