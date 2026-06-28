import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const ToastBridge = () => {
  const { t } = useTranslation();
  useEffect(() => {
    const update = () => {
      if (!navigator.onLine) toast.warn(t('offline'));
    };
    window.addEventListener('offline', update);
    return () => window.removeEventListener('offline', update);
  }, [t]);

  return null;
};

export default ToastBridge;
