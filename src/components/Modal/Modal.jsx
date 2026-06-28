import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import styles from './Modal.module.scss';

const Modal = ({ isOpen, onClose, title, children }) => {
  const { t } = useTranslation();
  return (
  <AnimatePresence>
    {isOpen && (
      <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.section
          className={styles.modal}
          initial={{ opacity: 0, y: 34, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
        >
          <header>
            <h2>{title}</h2>
            <button onClick={onClose} title={t('common.close')} aria-label={t('common.close')}><FiX /></button>
          </header>
          {children}
        </motion.section>
      </motion.div>
    )}
  </AnimatePresence>
  );
};

export default Modal;
