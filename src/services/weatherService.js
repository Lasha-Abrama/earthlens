import { openMeteoClient } from '../api/httpClient';

export const getCurrentWeather = async ([latitude, longitude]) => {
  const { data } = await openMeteoClient.get('/forecast', {
    params: {
      latitude,
      longitude,
      current: 'temperature_2m,wind_speed_10m,relative_humidity_2m',
      timezone: 'auto',
    },
  });
  return data.current;
};
