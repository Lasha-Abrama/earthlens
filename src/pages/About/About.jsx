import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiCompass, FiGlobe, FiHeart, FiMail, FiMap, FiShield } from 'react-icons/fi';
import Button from '../../components/Button/Button.jsx';
import styles from './About.module.scss';

const About = () => {
  const { t } = useTranslation();
  const cards = t('aboutPage.cards', { returnObjects: true });
  const steps = t('aboutPage.steps', { returnObjects: true });
  const icons = [<FiCompass />, <FiMap />, <FiHeart />];
  return (
  <motion.main className="page-shell" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
    <section className={styles.hero}>
      <span className="eyebrow">{t('aboutPage.eyebrow')}</span>
      <h1>{t('aboutPage.title')}</h1>
      <p>{t('aboutPage.copy')}</p>
    </section>

    <section className={styles.cards}>
      {cards.map((card, index) => (
        <article key={card.title}>
          {icons[index]}
          <h2>{card.title}</h2>
          <p>{card.copy}</p>
        </article>
      ))}
    </section>

    <section className={styles.timeline}>
      <div className="section-header">
        <div>
          <span className="eyebrow">{t('aboutPage.helpEyebrow')}</span>
          <h2>{t('aboutPage.helpTitle')}</h2>
        </div>
      </div>
      {steps.map((item, index) => (
        <article key={item}>
          <strong>{index + 1}</strong>
          <p>{item}</p>
        </article>
      ))}
    </section>

    <section className={styles.developer}>
      <FiShield />
      <div>
        <h2>{t('aboutPage.privacyTitle')}</h2>
        <p>{t('aboutPage.privacyCopy')}</p>
      </div>
      <div>
        <Button to="/explore" variant="secondary" icon={<FiGlobe />}>{t('nav.explore')}</Button>
        <Button to="mailto:hello@earthlens.dev" icon={<FiMail />}>{t('common.contact')}</Button>
      </div>
    </section>
  </motion.main>
  );
};

export default About;
