import { motion } from 'framer-motion';
import { FiHome } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button/Button.jsx';
import HeroGlobe from '../../components/HeroGlobe/HeroGlobe.jsx';
import styles from './NotFound.module.scss';

const NotFound = () => {
  const { t } = useTranslation();
  return (
  <motion.main className={styles.notFound} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <HeroGlobe />
    <span className="eyebrow">{t('notFound.eyebrow')}</span>
    <h1>{t('notFound.title')}</h1>
    <p>{t('notFound.copy')}</p>
    <Button to="/" icon={<FiHome />}>{t('notFound.action')}</Button>
  </motion.main>
  );
};

export default NotFound;
