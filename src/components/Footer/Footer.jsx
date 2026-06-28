import { FiGithub, FiGlobe, FiMail, FiMapPin } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

const Footer = () => {
  const { t } = useTranslation();
  return (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <div>
        <Link className={styles.brand} to="/">
          <FiGlobe /> EarthLens
        </Link>
        <p>{t('footer.tagline')}</p>
      </div>
      <div className={styles.links}>
        <Link to="/explore">{t('nav.explore')}</Link>
        <Link to="/compare">{t('nav.compare')}</Link>
        <Link to="/favorites">{t('nav.favorites')}</Link>
        <Link to="/wishlist">{t('nav.wishlist')}</Link>
        <Link to="/about">{t('nav.about')}</Link>
      </div>
      <div className={styles.social}>
        <a href="https://github.com/" aria-label={t('footer.github')}><FiGithub /></a>
        <a href="mailto:hello@earthlens.dev" aria-label={t('footer.email')}><FiMail /></a>
        <Link to="/explore" aria-label={t('nav.explore')}><FiMapPin /></Link>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
