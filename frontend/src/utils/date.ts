import { format } from 'date-fns';

import { DATE_FORMAT } from '../constants/format';

// TODO: Обрабатывать РУ локализацию
export const formatDate = (date: string) => {
  return format(date, DATE_FORMAT);
};
