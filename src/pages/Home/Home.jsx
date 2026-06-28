import { motion } from 'framer-motion';
import { FiArrowRight, FiBarChart2, FiCompass, FiGlobe, FiHeart, FiMap } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button/Button.jsx';
import HeroGlobe from '../../components/HeroGlobe/HeroGlobe.jsx';
import StatCard from '../../components/StatCard/StatCard.jsx';
import { FALLBACK_COUNTRY_IMAGES } from '../../constants/worldFacts.js';
import styles from './Home.module.scss';

const Home = () => (
  <motion.main className={styles.home} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <HeroSection />
    <FeaturedSection />
    <FactsSection />
    <WhySection />
    <Testimonials />
  </motion.main>
);

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section className={styles.hero}>
      <div className={styles.heroCopy}>
        <span className="eyebrow">{t('hero.eyebrow')}</span>
        <h1>{t('hero.title')}</h1>
        <p>{t('hero.copy')}</p>
        <div className={styles.heroActions}>
          <Button to="/explore" icon={<FiArrowRight />}>{t('hero.cta')}</Button>
          <Button to="/compare" variant="secondary" icon={<FiBarChart2 />}>{t('hero.secondary')}</Button>
        </div>
        <div className={styles.stats}>
          <StatCard icon={<FiGlobe />} value="253" label={t('home.stats.countries')} />
          <StatCard icon={<FiMap />} value="7" label={t('home.stats.continents')} />
          <StatCard icon={<FiHeart />} value="∞" label={t('home.stats.trips')} />
        </div>
      </div>
      <div className={styles.heroVisual}>
        <HeroGlobe />
        <motion.div className={styles.floatOne} animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 5 }}>
          {t('home.floating.intelligence')}
        </motion.div>
        <motion.div className={styles.floatTwo} animate={{ y: [0, 16, 0] }} transition={{ repeat: Infinity, duration: 6 }}>
          {t('home.floating.features')}
        </motion.div>
      </div>
    </section>
  );
};

const FeaturedSection = () => {
  const { t, i18n } = useTranslation();
  const featured = [
    [i18n.language === 'ka' ? 'იაპონია' : 'Japan', t('home.featured.japan'), FALLBACK_COUNTRY_IMAGES[0]],
    [i18n.language === 'ka' ? 'ისლანდია' : 'Iceland', t('home.featured.iceland'), FALLBACK_COUNTRY_IMAGES[2]],
    [i18n.language === 'ka' ? 'ბრაზილია' : 'Brazil', t('home.featured.brazil'), FALLBACK_COUNTRY_IMAGES[1]],
  ];
  return <section className="page-shell section">
    <div className="section-header">
      <div>
        <span className="eyebrow">{t('home.featured.eyebrow')}</span>
        <h2>{t('home.featured.title')}</h2>
      </div>
      <Button to="/explore" variant="secondary">{t('home.featured.action')}</Button>
    </div>
    <div className={styles.featured}>
      {featured.map(([name, copy, image]) => (
        <motion.article key={name} whileHover={{ y: -8 }}>
          <img src={image} alt={name} />
          <div>
            <h3>{name}</h3>
            <p>{copy}</p>
          </div>
        </motion.article>
      ))}
    </div>
  </section>;
};

const FactsSection = () => {
  const { t } = useTranslation();
  const facts = t('home.facts.items', { returnObjects: true });
  return <section className={`${styles.facts} section`}>
    <div className="page-shell">
      <div className="section-header">
        <div>
          <span className="eyebrow">{t('home.facts.eyebrow')}</span>
          <h2>{t('home.facts.title')}</h2>
        </div>
      </div>
      <div className={styles.factGrid}>
        {facts.map((fact, index) => (
          <motion.article key={fact} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <strong>{String(index + 1).padStart(2, '0')}</strong>
            <p>{fact}</p>
          </motion.article>
        ))}
      </div>
    </div>
  </section>;
};

const WhySection = () => {
  const { t } = useTranslation();
  return <section className="page-shell section">
    <div className="section-header">
      <div>
        <span className="eyebrow">{t('home.why.eyebrow')}</span>
        <h2>{t('home.why.title')}</h2>
      </div>
    </div>
    <div className={styles.why}>
      {[
        [<FiCompass />, t('home.why.exploreTitle'), t('home.why.exploreCopy')],
        [<FiBarChart2 />, t('home.why.compareTitle'), t('home.why.compareCopy')],
        [<FiHeart />, t('home.why.rememberTitle'), t('home.why.rememberCopy')],
      ].map(([icon, title, copy]) => (
        <article key={title}>
          {icon}
          <h3>{title}</h3>
          <p>{copy}</p>
        </article>
      ))}
    </div>
  </section>;
};

const Testimonials = () => {
  const { t } = useTranslation();
  const testimonials = t('home.testimonials', { returnObjects: true });
  return <section className="page-shell section">
    <div className={styles.testimonials}>
      {testimonials.map((quote) => <blockquote key={quote}>{quote}</blockquote>)}
    </div>
  </section>;
};

export default Home;
