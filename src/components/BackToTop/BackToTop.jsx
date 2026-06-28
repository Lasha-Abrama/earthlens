import { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import styles from './BackToTop.module.scss';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      className={`${styles.button} ${visible ? styles.visible : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title={t('common.backToTop')}
      aria-label={t('common.backToTop')}
    >
      <FiArrowUp />
    </button>
  );
};

export default BackToTop;
