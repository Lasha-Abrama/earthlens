import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import Button from '../../components/Button/Button.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import Modal from '../../components/Modal/Modal.jsx';
import StatCard from '../../components/StatCard/StatCard.jsx';
import { REST_COUNTRIES_API } from '../../constants/apiConfig.js';
import { useAppContext } from '../../context/AppContext.jsx';
import { formatCompact } from '../../utils/formatters.js';
import { useCountries } from '../../hooks/useCountries.js';
import { getLocalizedCapital, getLocalizedCountryName, getLocalizedRegion } from '../../utils/localization.js';
import styles from './Wishlist.module.scss';

const Wishlist = () => {
  const { wishlist, setWishlist, preferences, markVisited } = useAppContext();
  const { t, i18n } = useTranslation();
  const { countries } = useCountries();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const visitedCount = wishlist.filter((country) => preferences.visited.includes(country.cca3)).length;
  const progress = Math.round((visitedCount / REST_COUNTRIES_API.expectedTotal) * 100);

  return (
    <motion.main className="page-shell" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className={styles.header}>
        <span className="eyebrow">{t('wishlistPage.eyebrow')}</span>
        <h1>{t('wishlistPage.title')}</h1>
        <p>{t('wishlistPage.copy')}</p>
      </div>

      <div className={styles.stats}>
        <StatCard value={wishlist.length} label={t('wishlistPage.saved')} icon={<FiCheckCircle />} />
        <StatCard value={visitedCount} label={t('wishlistPage.visitedFromList')} icon={<FiCheckCircle />} />
        <StatCard value={`${progress}%`} label={t('wishlistPage.worldProgress')} icon={<FiCheckCircle />} />
      </div>

      {wishlist.length === 0 ? (
        <EmptyState title={t('wishlistPage.empty')} copy={t('wishlistPage.emptyCopy')} actionLabel={t('explore.eyebrow')} actionTo="/explore" />
      ) : (
        <>
          <div className={styles.toolbar}>
            <Button variant="danger" onClick={() => setConfirmOpen(true)} icon={<FiTrash2 />}>{t('wishlistPage.clearAll')}</Button>
          </div>
          <section className={styles.grid}>
            {wishlist.map((country) => {
              const visited = preferences.visited.includes(country.cca3);
              const fullCountry = countries.find((item) => item.cca3 === country.cca3);
              const displayCountry = fullCountry || {
                ...country,
                name: { common: country.name },
                cca2: country.cca2,
              };
              return (
                <article key={country.cca3}>
                  <img src={country.flag} alt={`${country.name} flag`} />
                  <div>
                    <h2>{getLocalizedCountryName(displayCountry, i18n.language)}</h2>
                    <p>{getLocalizedCapital(displayCountry, i18n.language, t('common.unknown'))} · {getLocalizedRegion(country.region, t)}</p>
                    <strong>{formatCompact(country.population, i18n.language)} {t('common.people')}</strong>
                  </div>
                  <div className={styles.actions}>
                    <Button variant={visited ? 'primary' : 'secondary'} onClick={() => markVisited(country.cca3)}>
                      {visited ? t('wishlistPage.visited') : t('wishlistPage.markVisited')}
                    </Button>
                    <Button variant="ghost" onClick={() => setWishlist((current) => current.filter((item) => item.cca3 !== country.cca3))}>
                      {t('common.remove')}
                    </Button>
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}

      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title={t('wishlistPage.clearTitle')}>
        <p className={styles.confirm}>{t('wishlistPage.clearCopy')}</p>
        <div className={styles.confirmActions}>
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>{t('common.cancel')}</Button>
          <Button variant="danger" onClick={() => { setWishlist([]); setConfirmOpen(false); }}>{t('wishlistPage.clearConfirm')}</Button>
        </div>
      </Modal>
    </motion.main>
  );
};

export default Wishlist;
