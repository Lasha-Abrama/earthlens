import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiRefreshCw, FiSearch, FiShuffle } from 'react-icons/fi';
import Button from '../../components/Button/Button.jsx';
import CountryCard from '../../components/CountryCard/CountryCard.jsx';
import CountryQuickView from '../../components/CountryQuickView/CountryQuickView.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import SkeletonCard from '../../components/SkeletonCard/SkeletonCard.jsx';
import { useAppContext } from '../../context/AppContext.jsx';
import { useCountries } from '../../hooks/useCountries.js';
import { getPopulationBand } from '../../utils/formatters.js';
import {
  getLocalizedCountryName,
  getLocalizedCurrencyName,
  getLocalizedLanguageName,
  getLocalizedRegion,
} from '../../utils/localization.js';
import styles from './Countries.module.scss';

const PAGE_SIZE = 24;

const Countries = () => {
  const { countries, isLoading, error, retry, facets } = useCountries();
  const { t, i18n } = useTranslation();
  const { rememberSearch } = useAppContext();
  const [quickView, setQuickView] = useState(null);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filters, setFilters] = useState({
    search: '',
    continent: '',
    language: '',
    currency: '',
    population: '',
    sort: 'az',
  });

  const filtered = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    return countries
      .filter((country) => {
        const matchesSearch = !term || [
          country.name.common,
          country.name.official,
          getLocalizedCountryName(country, i18n.language),
          country.capital?.[0],
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term));
        const matchesContinent = !filters.continent || country.continents?.includes(filters.continent);
        const matchesLanguage = !filters.language || Object.values(country.languages || {}).includes(filters.language);
        const matchesCurrency = !filters.currency || Object.values(country.currencies || {})
          .some((currency) => currency.name === filters.currency);
        const matchesPopulation = !filters.population || getPopulationBand(country.population) === filters.population;
        return matchesSearch && matchesContinent && matchesLanguage && matchesCurrency && matchesPopulation;
      })
      .sort((a, b) => {
        if (filters.sort === 'population') return b.population - a.population;
        if (filters.sort === 'area') return b.area - a.area;
        return a.name.common.localeCompare(b.name.common);
      });
  }, [countries, filters, i18n.language]);

  const onSearchBlur = () => rememberSearch(filters.search);
  const randomCountry = () => {
    const country = countries[Math.floor(Math.random() * countries.length)];
    if (country) setQuickView(country);
  };

  return (
    <motion.main className="page-shell" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className={styles.header}>
        <span className="eyebrow">{t('explore.eyebrow')}</span>
        <h1>{t('explore.title')}</h1>
        <p>{t('explore.copy')}</p>
      </div>

      <section className={styles.controls}>
        <label className={styles.search}>
          <FiSearch />
          <input
            value={filters.search}
            placeholder={t('explore.searchPlaceholder')}
            onBlur={onSearchBlur}
            onChange={(event) => {
              setVisible(PAGE_SIZE);
              setFilters((current) => ({ ...current, search: event.target.value }));
            }}
          />
        </label>
        <Select label={t('common.continent')} allLabel={t('common.all')} value={filters.continent} options={facets.continents} getLabel={(option) => getLocalizedRegion(option, t)} onChange={(continent) => setFilters((current) => ({ ...current, continent }))} />
        <Select label={t('common.languages')} allLabel={t('common.all')} value={filters.language} options={facets.languages} getLabel={(option) => getLocalizedLanguageName(option.code, option.value, i18n.language)} onChange={(language) => setFilters((current) => ({ ...current, language }))} />
        <Select label={t('common.currencies')} allLabel={t('common.all')} value={filters.currency} options={facets.currencies} getLabel={(option) => getLocalizedCurrencyName(option.code, option.value, i18n.language)} onChange={(currency) => setFilters((current) => ({ ...current, currency }))} />
        <Select label={t('common.population')} allLabel={t('common.all')} value={filters.population} options={facets.populationBands} getLabel={(option) => t(`populationBands.${option}`)} onChange={(population) => setFilters((current) => ({ ...current, population }))} />
        <Select label={t('explore.sort')} allLabel={t('common.all')} value={filters.sort} options={['az', 'population', 'area']} getLabel={(option) => t(`sortOptions.${option}`)} onChange={(sort) => setFilters((current) => ({ ...current, sort }))} />
        <Button variant="secondary" onClick={randomCountry} icon={<FiShuffle />}>{t('explore.random')}</Button>
      </section>

      {error && <EmptyState title={t('explore.noData')} copy={error} actionLabel={t('explore.refresh')} onAction={retry} />}
      {isLoading && <div className={styles.grid}>{Array.from({ length: 12 }, (_, index) => <SkeletonCard key={index} />)}</div>}
      {!isLoading && !error && filtered.length === 0 && <EmptyState title={t('explore.empty')} copy={t('explore.emptyCopy')} />}
      {!isLoading && !error && filtered.length > 0 && (
        <>
          <div className={styles.resultBar}>
            <strong>{filtered.length}</strong> {t('explore.matching')}
          </div>
          <div className={styles.grid}>
            {filtered.slice(0, visible).map((country) => (
              <CountryCard key={country.cca3} country={country} onQuickView={setQuickView} />
            ))}
          </div>
          {visible < filtered.length && (
            <div className={styles.more}>
              <Button onClick={() => setVisible((value) => value + PAGE_SIZE)} icon={<FiRefreshCw />}>{t('explore.loadMore')}</Button>
            </div>
          )}
        </>
      )}
      <CountryQuickView country={quickView} onClose={() => setQuickView(null)} />
    </motion.main>
  );
};

const Select = ({ label, allLabel, value, options, getLabel = (option) => option, onChange }) => (
  <label className={styles.select}>
    <span>{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">{allLabel}</option>
      {options.map((option) => {
        const optionValue = typeof option === 'object' ? option.value : option;
        return <option key={optionValue} value={optionValue}>{getLabel(option)}</option>;
      })}
    </select>
  </label>
);

export default Countries;
