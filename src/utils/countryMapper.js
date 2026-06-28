const toLanguageMap = (languages = []) =>
  languages.reduce((accumulator, language) => {
    const key = language.iso639_1 || language.iso639_3 || language.iso639_2t || language.name;
    if (key && language.name) accumulator[key] = language.name;
    return accumulator;
  }, {});

const toCurrencyMap = (currencies = []) =>
  currencies.reduce((accumulator, currency) => {
    const code = currency.code || currency.name;
    if (code) {
      accumulator[code] = {
        name: currency.name || code,
        symbol: currency.symbol || '',
      };
    }
    return accumulator;
  }, {});

export const mapV5Country = (country) => {
  const alpha2 = country.codes?.alpha_2 || '';
  const alpha3 = country.codes?.alpha_3 || country.uuid || country.names?.common;
  const primaryCapital = country.capitals?.find((capital) => capital.attributes?.primary) || country.capitals?.[0];
  const flagSvg = country.flag?.url_svg || (alpha2 ? `https://flagcdn.com/${alpha2.toLowerCase()}.svg` : '');
  const flagPng = country.flag?.url_png || (alpha2 ? `https://flagcdn.com/w640/${alpha2.toLowerCase()}.png` : '');

  return {
    name: {
      common: country.names?.common || 'Unknown country',
      official: country.names?.official || country.names?.common || 'Unknown country',
    },
    cca2: alpha2,
    cca3: alpha3,
    capital: country.capitals?.map((capital) => capital.name).filter(Boolean) || [],
    region: country.region || 'Unknown',
    subregion: country.subregion || '',
    population: country.population || 0,
    area: country.area?.kilometers || 0,
    flags: {
      svg: flagSvg || flagPng,
      png: flagPng || flagSvg,
      alt: country.flag?.description || `Flag of ${country.names?.common || 'country'}`,
    },
    coatOfArms: {},
    languages: toLanguageMap(country.languages),
    currencies: toCurrencyMap(country.currencies),
    timezones: country.timezones || [],
    continents: country.continents || [],
    borders: country.borders || [],
    maps: {
      googleMaps: country.links?.google_maps || '',
      openStreetMaps: country.links?.open_street_maps || '',
    },
    latlng: [country.coordinates?.lat, country.coordinates?.lng].filter((value) => typeof value === 'number'),
    capitalInfo: {
      latlng: [primaryCapital?.coordinates?.lat, primaryCapital?.coordinates?.lng].filter(
        (value) => typeof value === 'number',
      ),
    },
    independent: country.classification?.sovereign ?? true,
    unMember: country.classification?.un_member ?? false,
  };
};

export const normalizeCountry = (country) => (country.names ? mapV5Country(country) : country);
