import { apiBasis } from '@/constants';

import type { EventsResponseDto } from './dto';

export const getEvents = async (
  search?: string,
): Promise<EventsResponseDto> => {
  const searchParams = new URLSearchParams();

  if (search) {
    searchParams.append('search', search);
  }

  const events = await apiBasis
    .get('events', { searchParams })
    .json<EventsResponseDto>();

  return events;
};
