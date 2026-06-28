import axios from 'axios';

export const getCountrySummary = async (title, language = 'en') => {
  const locale = language === 'ka' ? 'ka' : 'en';
  const { data } = await axios.get(
    `https://${locale}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    { timeout: 12000 },
  );
  return data;
};
