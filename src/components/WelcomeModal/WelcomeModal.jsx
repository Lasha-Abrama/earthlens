import { useState } from 'react';
import { FiCompass } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { STORAGE_KEYS } from '../../constants/storageKeys.js';
import { readStorage, writeStorage } from '../../utils/storage.js';
import Button from '../Button/Button.jsx';
import Modal from '../Modal/Modal.jsx';
import styles from './WelcomeModal.module.scss';

const WelcomeModal = () => {
  const [open, setOpen] = useState(() => !readStorage(STORAGE_KEYS.welcomeSeen, false));
  const { t } = useTranslation();
  const close = () => {
    writeStorage(STORAGE_KEYS.welcomeSeen, true);
    setOpen(false);
  };

  return (
    <Modal isOpen={open} onClose={close} title={t('welcome.title')}>
      <div className={styles.welcome}>
        <FiCompass />
        <p>{t('welcome.copy')}</p>
        <Button onClick={close}>{t('welcome.button')}</Button>
      </div>
    </Modal>
  );
};

export default WelcomeModal;
