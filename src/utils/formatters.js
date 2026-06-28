export const formatNumber = (value, locale = 'en-US') =>
  typeof value === 'number' ? new Intl.NumberFormat(locale).format(value) : 'Unknown';

export const formatCompact = (value, locale = 'en-US') =>
  typeof value === 'number'
    ? new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(value)
    : 'Unknown';

export const listNames = (items, fallback = 'Unknown') => {
  if (!items) return fallback;
  if (Array.isArray(items)) return items.length ? items.join(', ') : fallback;
  if (typeof items === 'object') return Object.values(items).join(', ') || fallback;
  return String(items);
};

export const getCurrencies = (currencies) =>
  currencies
    ? Object.values(currencies)
        .map((currency) => `${currency.name}${currency.symbol ? ` (${currency.symbol})` : ''}`)
        .join(', ')
    : 'Unknown';

export const getCountrySlug = (country) => country?.cca3 || country?.name?.common;

export const getPopulationBand = (population) => {
  if (!population) return 'unknown';
  if (population < 1_000_000) return 'small';
  if (population < 20_000_000) return 'medium';
  if (population < 100_000_000) return 'large';
  return 'mega';
};
