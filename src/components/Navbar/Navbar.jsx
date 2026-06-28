import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiGlobe, FiHeart, FiMenu, FiMoon, FiSearch, FiSun, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import styles from './Navbar.module.scss';

const Navbar = () => {
  const { t } = useTranslation();
  const { theme, setTheme, language, setLanguage, wishlist } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const links = [
    ['/', t('nav.home')],
    ['/explore', t('nav.explore')],
    ['/compare', t('nav.compare')],
    ['/favorites', t('nav.favorites')],
    ['/wishlist', t('nav.wishlist')],
    ['/about', t('nav.about')],
  ];

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink to="/" className={styles.logo} onClick={() => setIsOpen(false)}>
          <FiGlobe />
          <span>EarthLens</span>
        </NavLink>

        <div className={`${styles.links} ${isOpen ? styles.open : ''}`}>
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => (isActive ? styles.active : undefined)}
              onClick={() => setIsOpen(false)}
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className={styles.actions}>
          <NavLink className={`${styles.iconButton} ${styles.desktopAction}`} to="/explore" title={t('common.search')}>
            <FiSearch />
          </NavLink>
          <NavLink className={`${styles.iconButton} ${styles.desktopAction}`} to="/wishlist" title={t('common.wishlist')}>
            <FiHeart />
            {wishlist.length > 0 && <span>{wishlist.length}</span>}
          </NavLink>
          <button
            className={styles.iconButton}
            title={t('common.toggleTheme')}
            aria-label={t('common.toggleTheme')}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          <button
            className={styles.lang}
            onClick={() => setLanguage(language === 'en' ? 'ka' : 'en')}
            title={t('common.switchLanguage')}
            aria-label={t('common.switchLanguage')}
          >
            {language === 'en' ? 'KA' : 'EN'}
          </button>
          <button className={styles.menu} onClick={() => setIsOpen((value) => !value)} title={t('common.menu')} aria-label={t('common.menu')}>
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
