import { apiBasis } from '@/constants';
import { EventsType } from '@/types';

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

export const fetchEvents = async (): Promise<EventsType[]> => {
  return apiBasis.get('events').json<EventsType[]>();
};

export const createEvent = async (
  data: Omit<EventsType, 'id' | 'createdAt'>,
): Promise<EventsType> => {
  return apiBasis
    .post('events', {
      json: data,
    })
    .json<EventsType>();
};

export const updateEvent = async (
  id: number,
  data: Partial<Omit<EventsType, 'id' | 'createdAt'>>,
): Promise<EventsType> => {
  return apiBasis
    .put(`events/${id}`, {
      json: data,
    })
    .json<EventsType>();
};
