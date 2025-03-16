import ky from 'ky';

export const API_URL = 'http://localhost:8000/api';

export const apiBasis = ky.create({
  prefixUrl: API_URL,
});
