import kaCurrenciesData from 'cldr-numbers-full/main/ka/currencies.json';
import kaLanguagesData from 'cldr-localenames-full/main/ka/languages.json';
import kaTerritoriesData from 'cldr-localenames-full/main/ka/territories.json';
import kaCapitals from '../assets/capitals-ka.json';

const kaCurrencies = kaCurrenciesData.main.ka.numbers.currencies;
const kaLanguages = kaLanguagesData.main.ka.localeDisplayNames.languages;
const kaTerritories = kaTerritoriesData.main.ka.localeDisplayNames.territories;
const kaLanguageOverrides = {
  bwg: 'ბარვე',
  bjz: 'ბელიზური კრეოლი',
  cal: 'კაროლინური',
  cnr: 'მონტენეგრული',
  hgm: 'ჰაიომი',
  hif: 'ფიჯის ჰინდი',
  ho: 'ჰირი-მოტუ',
  jam: 'იამაიკური პატუა',
  kck: 'კალანგა',
  khi: 'ხოისანური ენები',
  kwn: 'კვანგალი',
  mey: 'ჰასანიური არაბული',
  ndc: 'ნდაუ',
  nrf: 'ნორმანული',
  nzs: 'ახალი ზელანდიის ჟესტური ენა',
  pih: 'ნორფუკი',
  pov: 'ზემო გვინეის კრეოლური',
  prs: 'დარი',
  tkl: 'ტოკელაური',
  toi: 'ზამბიური ტონგა',
  zdj: 'ნგაზიჯის კომორული',
  zib: 'ზიმბაბვური ჟესტური ენა',
};

export const getLocalizedCountryName = (country, language = 'en') => {
  if (!country) return '';
  if (language !== 'ka' || !country.cca2) return country.name.common;
  return kaTerritories[country.cca2] || country.name.common;
};

export const getLocalizedRegion = (region, t) => {
  const key = String(region || '').toLowerCase().replace(/\s+/g, '');
  return t(`regions.${key}`, { defaultValue: region || t('common.unknown') });
};

export const getLocalizedSubregion = (subregion, t) => {
  const key = String(subregion || '').toLowerCase().replace(/[^a-z]/g, '');
  return t(`subregions.${key}`, { defaultValue: subregion || t('common.unknown') });
};

export const getLocalizedCapital = (country, language = 'en', fallback = 'Unknown') => {
  const sourceCapital = Array.isArray(country?.capital) ? country.capital[0] : country?.capital;
  if (language === 'ka' && country?.cca2 && kaCapitals[country.cca2]?.length) {
    return kaCapitals[country.cca2].join(', ');
  }
  return sourceCapital || fallback;
};

export const getLocalizedLanguages = (languages, language = 'en', fallback = 'Unknown') => {
  if (!languages || Object.keys(languages).length === 0) return fallback;
  if (language !== 'ka') return Object.values(languages).join(', ');

  return Object.entries(languages)
    .map(([code, name]) => kaLanguageOverrides[code] || kaLanguages[code] || name)
    .join(', ');
};

export const getLocalizedLanguageName = (code, name, language = 'en') => {
  if (language !== 'ka') return name;
  return kaLanguageOverrides[code] || kaLanguages[code] || name;
};

export const getLocalizedCurrencyName = (code, name, language = 'en') => {
  if (language !== 'ka') return name;
  return kaCurrencies[code]?.displayName || name;
};

export const getLocalizedCurrencies = (currencies, language = 'en', fallback = 'Unknown') => {
  if (!currencies || Object.keys(currencies).length === 0) return fallback;
  return Object.entries(currencies)
    .map(([code, currency]) => {
      let name = currency.name || code;
      if (language === 'ka') name = kaCurrencies[code]?.displayName || name;
      return `${name}${currency.symbol ? ` (${currency.symbol})` : ''}`;
    })
    .join(', ');
};
