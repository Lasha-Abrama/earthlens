import { useCallback, useEffect, useMemo, useState } from 'react';
import { fallbackCountries } from '../constants/fallbackCountries';
import { getAllCountries } from '../services/countriesService';
import { getPopulationBand } from '../utils/formatters';

export const useCountries = () => {
  const [countries, setCountries] = useState(() =>
    [...fallbackCountries].sort((a, b) => a.name.common.localeCompare(b.name.common)),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCountries = useCallback(async () => {
    setError('');
    setIsLoading(false);
    try {
      const data = await getAllCountries();
      setCountries(data);
    } catch {
      setError('');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  const facets = useMemo(() => {
    const continents = new Set();
    const languages = new Map();
    const currencies = new Map();

    countries.forEach((country) => {
      country.continents?.forEach((continent) => continents.add(continent));
      Object.entries(country.languages || {}).forEach(([code, language]) => languages.set(code, language));
      Object.entries(country.currencies || {}).forEach(([code, currency]) => currencies.set(code, currency.name));
    });

    return {
      continents: [...continents].sort(),
      languages: [...languages].map(([code, value]) => ({ code, value })).sort((a, b) => a.value.localeCompare(b.value)),
      currencies: [...currencies].map(([code, value]) => ({ code, value })).sort((a, b) => a.value.localeCompare(b.value)),
      populationBands: ['small', 'medium', 'large', 'mega'],
      getPopulationBand,
    };
  }, [countries]);

  return { countries, isLoading, error, retry: fetchCountries, facets };
};
