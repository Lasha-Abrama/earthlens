import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import Button from '../../components/Button/Button.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import StatCard from '../../components/StatCard/StatCard.jsx';
import { REST_COUNTRIES_API } from '../../constants/apiConfig.js';
import { useAppContext } from '../../context/AppContext.jsx';
import { formatCompact } from '../../utils/formatters.js';
import { useCountries } from '../../hooks/useCountries.js';
import { getLocalizedCapital, getLocalizedCountryName, getLocalizedRegion } from '../../utils/localization.js';
import styles from './Favorites.module.scss';

const Favorites = () => {
  const { favorites, setFavorites } = useAppContext();
  const { t, i18n } = useTranslation();
  const { countries } = useCountries();
  const progress = Math.round((favorites.length / REST_COUNTRIES_API.expectedTotal) * 100);

  return (
    <motion.main className="page-shell" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className={styles.header}>
        <span className="eyebrow">{t('favoritesPage.eyebrow')}</span>
        <h1>{t('favoritesPage.title')}</h1>
        <p>{t('favoritesPage.copy')}</p>
      </div>

      <div className={styles.stats}>
        <StatCard value={favorites.length} label={t('favoritesPage.saved')} icon={<FiHeart />} />
        <StatCard value={`${progress}%`} label={t('favoritesPage.progress')} icon={<FiHeart />} />
      </div>

      {favorites.length === 0 ? (
        <EmptyState title={t('favoritesPage.empty')} copy={t('favoritesPage.emptyCopy')} actionLabel={t('explore.eyebrow')} actionTo="/explore" />
      ) : (
        <section className={styles.grid}>
          {favorites.map((country) => {
            const fullCountry = countries.find((item) => item.cca3 === country.cca3);
            const displayCountry = fullCountry || {
              ...country,
              name: { common: country.name },
              cca2: country.cca2,
            };
            return <article key={country.cca3}>
              <img src={country.flag} alt={`${country.name} flag`} />
              <div>
                <h2>{getLocalizedCountryName(displayCountry, i18n.language)}</h2>
                <p>{getLocalizedCapital(displayCountry, i18n.language, t('common.unknown'))} · {getLocalizedRegion(country.region, t)}</p>
                <strong>{formatCompact(country.population, i18n.language)} {t('common.people')}</strong>
              </div>
              <Button
                variant="secondary"
                icon={<FiTrash2 />}
                onClick={() => setFavorites((current) => current.filter((item) => item.cca3 !== country.cca3))}
              >
                {t('common.remove')}
              </Button>
            </article>;
          })}
        </section>
      )}
    </motion.main>
  );
};

export default Favorites;
