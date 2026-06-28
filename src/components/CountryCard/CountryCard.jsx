import { memo } from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiHeart, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext.jsx';
import { formatCompact } from '../../utils/formatters.js';
import { getLocalizedCapital, getLocalizedCountryName, getLocalizedRegion } from '../../utils/localization.js';
import styles from './CountryCard.module.scss';

const CountryCard = ({ country, onQuickView }) => {
  const { toggleFavorite, isFavorite } = useAppContext();
  const { t, i18n } = useTranslation();
  const active = isFavorite(country.cca3);
  const countryName = getLocalizedCountryName(country, i18n.language);
  const locale = i18n.language === 'ka' ? 'ka-GE' : 'en-US';

  return (
    <motion.article className={styles.card} whileHover={{ y: -7 }} layout>
      <Link to={`/country/${country.cca3}`} className={styles.flagWrap}>
        {country.flags.svg ? (
          <img loading="lazy" src={country.flags.svg} alt={countryName} />
        ) : (
          <span className={styles.flagFallback}>{countryName}</span>
        )}
      </Link>
      <div className={styles.body}>
        <div>
          <p>{getLocalizedRegion(country.region, t)}</p>
          <h3>{countryName}</h3>
        </div>
        <button
          className={`${styles.favorite} ${active ? styles.active : ''}`}
          onClick={() => toggleFavorite(country)}
          title={t('common.favorites')}
          aria-label={`${t('common.favorites')}: ${countryName}`}
        >
          <FiHeart />
        </button>
      </div>
      <dl className={styles.meta}>
        <div><dt><FiMapPin /> {t('common.capital')}</dt><dd>{getLocalizedCapital(country, i18n.language, t('common.unknown'))}</dd></div>
        <div><dt>{t('common.population')}</dt><dd>{formatCompact(country.population, locale)}</dd></div>
      </dl>
      <div className={styles.actions}>
        <Link to={`/country/${country.cca3}`}>{t('common.details')}</Link>
        <button onClick={() => onQuickView(country)}><FiEye /> {t('common.quickView')}</button>
      </div>
    </motion.article>
  );
};

export default memo(CountryCard);
