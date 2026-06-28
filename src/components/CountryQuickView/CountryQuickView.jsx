import { FiExternalLink, FiHeart, FiMapPin } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Modal from '../Modal/Modal.jsx';
import Button from '../Button/Button.jsx';
import { useAppContext } from '../../context/AppContext.jsx';
import { formatNumber } from '../../utils/formatters.js';
import {
  getLocalizedCountryName,
  getLocalizedCapital,
  getLocalizedCurrencies,
  getLocalizedLanguages,
  getLocalizedRegion,
} from '../../utils/localization.js';
import styles from './CountryQuickView.module.scss';

const CountryQuickView = ({ country, onClose }) => {
  const { toggleWishlist } = useAppContext();
  const { t, i18n } = useTranslation();
  if (!country) return null;
  const countryName = getLocalizedCountryName(country, i18n.language);
  const locale = i18n.language === 'ka' ? 'ka-GE' : 'en-US';

  return (
    <Modal isOpen={Boolean(country)} onClose={onClose} title={countryName}>
      <div className={styles.quick}>
        {country.flags.svg ? (
          <img src={country.flags.svg} alt={countryName} />
        ) : (
          <div className={styles.flagFallback}>{countryName}</div>
        )}
        <div className={styles.grid}>
          <span><strong>{t('common.capital')}</strong>{getLocalizedCapital(country, i18n.language, t('common.unknown'))}</span>
          <span><strong>{t('common.population')}</strong>{formatNumber(country.population, locale)}</span>
          <span><strong>{t('common.region')}</strong>{getLocalizedRegion(country.region, t)}</span>
          <span><strong>{t('common.languages')}</strong>{getLocalizedLanguages(country.languages, i18n.language, t('common.unknown'))}</span>
          <span><strong>{t('common.currencies')}</strong>{getLocalizedCurrencies(country.currencies, i18n.language, t('common.unknown'))}</span>
          <span><strong>{t('common.timezone')}</strong>{country.timezones?.[0]}</span>
        </div>
        <div className={styles.actions}>
          <Button to={`/country/${country.cca3}`} icon={<FiExternalLink />}>{t('actions.openDetails')}</Button>
          <Button variant="secondary" onClick={() => toggleWishlist(country)} icon={<FiHeart />}>{t('actions.addToWishlist')}</Button>
          {country.maps?.googleMaps && (
            <Link className={styles.map} to={country.maps.googleMaps} target="_blank">
              <FiMapPin /> {t('common.googleMaps')}
            </Link>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CountryQuickView;
