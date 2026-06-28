import { motion } from 'framer-motion';
import styles from './HeroGlobe.module.scss';

const HeroGlobe = () => (
  <div className={styles.scene} aria-hidden="true">
    <motion.div
      className={styles.globe}
      animate={{ rotate: 360 }}
      transition={{ duration: 44, repeat: Infinity, ease: 'linear' }}
    >
      <span className={styles.grid} />
      <span className={styles.landOne} />
      <span className={styles.landTwo} />
      <span className={styles.landThree} />
    </motion.div>
    <motion.div className={styles.orbit} animate={{ rotate: -360 }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}>
      <span />
    </motion.div>
  </div>
);

export default HeroGlobe;
