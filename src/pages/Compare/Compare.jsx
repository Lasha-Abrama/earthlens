import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiBarChart2 } from 'react-icons/fi';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import SkeletonCard from '../../components/SkeletonCard/SkeletonCard.jsx';
import { useAppContext } from '../../context/AppContext.jsx';
import { useCountries } from '../../hooks/useCountries.js';
import { formatNumber } from '../../utils/formatters.js';
import {
  getLocalizedCountryName,
  getLocalizedCapital,
  getLocalizedCurrencies,
  getLocalizedLanguages,
  getLocalizedRegion,
  getLocalizedSubregion,
} from '../../utils/localization.js';
import styles from './Compare.module.scss';

const Compare = () => {
  const { countries, isLoading } = useCountries();
  const { t, i18n } = useTranslation();
  const { setComparisonHistory } = useAppContext();
  const [leftCode, setLeftCode] = useState('USA');
  const [rightCode, setRightCode] = useState('JPN');
  const left = countries.find((country) => country.cca3 === leftCode);
  const right = countries.find((country) => country.cca3 === rightCode);

  const rows = useMemo(() => {
    if (!left || !right) return [];
    return [
      [t('common.population'), formatNumber(left.population, i18n.language), formatNumber(right.population, i18n.language), left.population, right.population],
      [t('common.area'), `${formatNumber(left.area, i18n.language)} km²`, `${formatNumber(right.area, i18n.language)} km²`, left.area, right.area],
      [t('common.capital'), getLocalizedCapital(left, i18n.language, t('common.unknown')), getLocalizedCapital(right, i18n.language, t('common.unknown'))],
      [t('common.currencies'), getLocalizedCurrencies(left.currencies, i18n.language, t('common.unknown')), getLocalizedCurrencies(right.currencies, i18n.language, t('common.unknown'))],
      [t('common.languages'), getLocalizedLanguages(left.languages, i18n.language, t('common.unknown')), getLocalizedLanguages(right.languages, i18n.language, t('common.unknown'))],
      [t('common.timezone'), left.timezones?.[0], right.timezones?.[0]],
      [t('common.region'), getLocalizedRegion(left.region, t), getLocalizedRegion(right.region, t)],
      [t('compare.subregion'), getLocalizedSubregion(left.subregion, t), getLocalizedSubregion(right.subregion, t)],
    ];
  }, [left, right, t, i18n.language]);

  useEffect(() => {
    if (!left || !right) return;
    const comparison = `${left.name.common} vs ${right.name.common}`;
    setComparisonHistory((current) => [comparison, ...current.filter((item) => item !== comparison)].slice(0, 8));
  }, [left, right, setComparisonHistory]);

  return (
    <motion.main className="page-shell" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className={styles.header}>
        <span className="eyebrow">{t('compare.eyebrow')}</span>
        <h1>{t('compare.title')}</h1>
        <p>{t('compare.copy')}</p>
      </div>

      {isLoading && <div className={styles.grid}><SkeletonCard /><SkeletonCard /></div>}
      {!isLoading && countries.length === 0 && <EmptyState title={t('compare.noData')} copy={t('compare.refresh')} />}
      {!isLoading && countries.length > 0 && (
        <>
          <section className={styles.selectors}>
            <CountrySelect label={t('compare.first')} value={leftCode} countries={countries} language={i18n.language} onChange={setLeftCode} />
            <FiBarChart2 />
            <CountrySelect label={t('compare.second')} value={rightCode} countries={countries} language={i18n.language} onChange={setRightCode} />
          </section>

          {left && right && (
            <section className={styles.compare}>
              <CountryHeader country={left} language={i18n.language} t={t} />
              <CountryHeader country={right} language={i18n.language} t={t} />
              {rows.map(([label, leftValue, rightValue, leftRaw, rightRaw]) => (
                <div className={styles.row} key={label}>
                  <span>{label}</span>
                  <strong className={leftRaw > rightRaw ? styles.winner : ''}>{leftValue}</strong>
                  <strong className={rightRaw > leftRaw ? styles.winner : ''}>{rightValue}</strong>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </motion.main>
  );
};

const CountrySelect = ({ label, value, countries, language, onChange }) => (
  <label className={styles.select}>
    <span>{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {countries.map((country) => (
        <option key={country.cca3} value={country.cca3}>{getLocalizedCountryName(country, language)}</option>
      ))}
    </select>
  </label>
);

const CountryHeader = ({ country, language, t }) => (
  <article className={styles.countryHeader}>
    <img src={country.flags.svg} alt={country.flags.alt || `${country.name.common} flag`} />
    <div>
      <h2>{getLocalizedCountryName(country, language)}</h2>
      <p>{getLocalizedRegion(country.region, t)}</p>
    </div>
  </article>
);

export default Compare;
