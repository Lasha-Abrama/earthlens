import { FiCompass } from 'react-icons/fi';
import Button from '../Button/Button.jsx';
import styles from './EmptyState.module.scss';

const EmptyState = ({ title, copy, actionLabel, actionTo, onAction }) => (
  <section className={styles.empty}>
    <FiCompass />
    <h2>{title}</h2>
    <p>{copy}</p>
    {(actionLabel && actionTo) && <Button to={actionTo}>{actionLabel}</Button>}
    {(actionLabel && onAction) && <Button onClick={onAction}>{actionLabel}</Button>}
  </section>
);

export default EmptyState;
