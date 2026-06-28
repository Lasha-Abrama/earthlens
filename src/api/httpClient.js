import axios from 'axios';

export const openMeteoClient = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 12000,
});
