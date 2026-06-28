import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { FiCopy, FiExternalLink, FiHeart, FiMapPin, FiShare2 } from 'react-icons/fi';
import Button from '../../components/Button/Button.jsx';
import EmptyState from '../../components/EmptyState/EmptyState.jsx';
import SkeletonCard from '../../components/SkeletonCard/SkeletonCard.jsx';
import StatCard from '../../components/StatCard/StatCard.jsx';
import { FALLBACK_COUNTRY_IMAGES } from '../../constants/worldFacts.js';
import { useAppContext } from '../../context/AppContext.jsx';
import { getCountriesByCodes, getCountryByCode } from '../../services/countriesService.js';
import { getCountrySummary } from '../../services/wikiService.js';
import { getCurrentWeather } from '../../services/weatherService.js';
import { formatNumber } from '../../utils/formatters.js';
import {
  getLocalizedCountryName,
  getLocalizedCapital,
  getLocalizedCurrencies,
  getLocalizedLanguages,
  getLocalizedRegion,
} from '../../utils/localization.js';
import styles from './CountryDetails.module.scss';

const CountryDetails = () => {
  const { code } = useParams();
  const { t, i18n } = useTranslation();
  const { toggleFavorite, toggleWishlist, addRecentView, isFavorite } = useAppContext();
  const [country, setCountry] = useState(null);
  const [borders, setBorders] = useState([]);
  const [summary, setSummary] = useState(null);
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getCountryByCode(code);
        if (!mounted) return;
        setCountry(data);
        addRecentView(data);
        const [borderData, wikiData, weatherData] = await Promise.allSettled([
          getCountriesByCodes(data.borders || []),
          getCountrySummary(getLocalizedCountryName(data, i18n.language), i18n.language),
          data.capitalInfo?.latlng ? getCurrentWeather(data.capitalInfo.latlng) : Promise.resolve(null),
        ]);
        if (!mounted) return;
        setBorders(borderData.status === 'fulfilled' ? borderData.value : []);
        setSummary(wikiData.status === 'fulfilled' ? wikiData.value : null);
        setWeather(weatherData.status === 'fulfilled' ? weatherData.value : null);
      } catch {
        if (mounted) setError(t('details.unavailable'));
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [code, addRecentView, t, i18n.language]);

  const heroImage = code === 'GEO' && country?.flags?.svg
    ? country.flags.svg
    : summary?.originalimage?.source
      || summary?.thumbnail?.source
      || FALLBACK_COUNTRY_IMAGES[code?.length % FALLBACK_COUNTRY_IMAGES.length];

  const facts = useMemo(() => {
    if (!country) return [];
    const countryName = getLocalizedCountryName(country, i18n.language);
    const region = getLocalizedRegion(country.region, t);
    return [
      [t('details.officialName'), i18n.language === 'ka' ? countryName : country.name.official],
      [t('common.capital'), getLocalizedCapital(country, i18n.language, t('common.unknown'))],
      [t('common.region'), i18n.language === 'ka' ? region : `${region}${country.subregion ? `, ${country.subregion}` : ''}`],
      [t('common.languages'), getLocalizedLanguages(country.languages, i18n.language, t('common.unknown'))],
      [t('common.currencies'), getLocalizedCurrencies(country.currencies, i18n.language, t('common.unknown'))],
      [t('details.timezones'), country.timezones?.join(', ')],
      [t('details.continents'), country.continents?.map((continent) => getLocalizedRegion(continent, t)).join(', ')],
      [t('details.unMember'), country.unMember ? t('details.yes') : t('details.no')],
    ];
  }, [country, t, i18n.language]);

  const copyInfo = async () => {
    await navigator.clipboard.writeText(t('details.copyTemplate', {
      country: getLocalizedCountryName(country, i18n.language),
      capital: getLocalizedCapital(country, i18n.language, t('common.unknown')),
      population: formatNumber(country.population, i18n.language),
    }));
    toast.success(t('details.copied'));
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: getLocalizedCountryName(country, i18n.language), url });
    else {
      await navigator.clipboard.writeText(url);
      toast.success(t('details.linkCopied'));
    }
  };

  if (isLoading) {
    return <main className="page-shell"><div className={styles.grid}>{Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} />)}</div></main>;
  }

  if (error || !country) return <main className="page-shell"><EmptyState title={t('details.notFound')} copy={error} actionLabel={t('explore.eyebrow')} actionTo="/explore" /></main>;

  const countryName = getLocalizedCountryName(country, i18n.language);
  const localizedRegion = getLocalizedRegion(country.region, t);

  return (
    <motion.main className={styles.details} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className={styles.hero} style={{ backgroundImage: `linear-gradient(90deg, rgba(2, 6, 23, .82), rgba(2, 6, 23, .2)), url(${heroImage})` }}>
        <div>
          <span className="eyebrow">{localizedRegion}</span>
          <h1>{countryName}</h1>
          <p>{summary?.extract || t('details.summaryFallback', { country: countryName, region: localizedRegion })}</p>
          <div className={styles.heroActions}>
            <Button onClick={() => toggleFavorite(country)} icon={<FiHeart />}>{t(isFavorite(country.cca3) ? 'details.favorited' : 'details.favorite')}</Button>
            <Button variant="secondary" onClick={() => toggleWishlist(country)} icon={<FiMapPin />}>{t('actions.addToWishlist')}</Button>
            <Button variant="secondary" onClick={share} icon={<FiShare2 />}>{t('details.share')}</Button>
            <Button variant="secondary" onClick={copyInfo} icon={<FiCopy />}>{t('details.copy')}</Button>
          </div>
        </div>
      </section>

      <section className="page-shell">
        <div className={styles.stats}>
          <StatCard value={formatNumber(country.population, i18n.language)} label={t('common.population')} icon={<FiMapPin />} />
          <StatCard value={`${formatNumber(country.area, i18n.language)} km²`} label={t('common.area')} icon={<FiExternalLink />} />
          <StatCard value={weather ? `${Math.round(weather.temperature_2m)}°C` : t('common.notAvailable')} label={t('details.weather')} icon={<FiMapPin />} />
        </div>

        <div className={styles.content}>
          <article className={styles.panel}>
            <h2>{t('details.facts')}</h2>
            <div className={styles.factList}>
              {facts.map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value || t('common.unknown')}</strong>
                </div>
              ))}
            </div>
          </article>
          <article className={styles.panel}>
            <h2>{t('details.symbols')}</h2>
            <div className={styles.symbols}>
              {country.flags.svg && <img src={country.flags.svg} alt={countryName} />}
              {country.coatOfArms?.svg && <img src={country.coatOfArms.svg} alt={`${country.name.common} coat of arms`} />}
            </div>
            {country.maps?.googleMaps && (
              <a className={styles.mapLink} href={country.maps.googleMaps} target="_blank" rel="noreferrer">
                <FiMapPin /> {t('details.openMaps')}
              </a>
            )}
          </article>
        </div>

        {borders.length > 0 && (
          <section className={`${styles.panel} ${styles.borderPanel}`}>
            <h2>{t('details.borders')}</h2>
            <div className={styles.borders}>
              {borders.map((border) => (
                <Link key={border.cca3} to={`/country/${border.cca3}`}>{getLocalizedCountryName(border, i18n.language)}</Link>
              ))}
            </div>
          </section>
        )}
      </section>
    </motion.main>
  );
};

export default CountryDetails;
