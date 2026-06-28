import countryAtlas from '../assets/countries-v5.json';
import { fallbackCountries, getFallbackCountryByCode } from '../constants/fallbackCountries';
import { mapV5Country } from '../utils/countryMapper';

const sortCountries = (countries) => countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
const bundledCountries = sortCountries(
  countryAtlas.objects
    .filter((country) => country.names?.common !== 'Abkhazia')
    .map(mapV5Country),
);

export const getAllCountries = async () => {
  return bundledCountries.length ? bundledCountries : sortCountries([...fallbackCountries]);
};

export const getCountryByCode = async (code) => {
  const atlasMatch = bundledCountries.find(
    (country) => country.cca3 === code || country.cca2 === code || country.name.common === code,
  );
  if (atlasMatch) return atlasMatch;

  const fallback = getFallbackCountryByCode(code);
  if (!fallback) throw new Error('Country not available');
  return fallback;
};

export const getCountriesByCodes = async (codes = []) => {
  if (!codes.length) return [];
  try {
    const countries = await Promise.all(codes.map(getCountryByCode));
    return countries.filter(Boolean);
  } catch {
    return codes.map(getFallbackCountryByCode).filter(Boolean);
  }
};
