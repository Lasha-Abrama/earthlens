import { motion, useScroll } from 'framer-motion';
import styles from './ScrollProgress.module.scss';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return <motion.div className={styles.progress} style={{ scaleX: scrollYProgress }} />;
};

export default ScrollProgress;
