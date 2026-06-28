import { motion } from 'framer-motion';
import styles from './StatCard.module.scss';

const StatCard = ({ icon, label, value }) => (
  <motion.div className={styles.card} whileHover={{ y: -4 }}>
    <span>{icon}</span>
    <strong>{value}</strong>
    <small>{label}</small>
  </motion.div>
);

export default StatCard;
