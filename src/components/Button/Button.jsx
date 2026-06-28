import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

const Button = ({ children, to, variant = 'primary', icon, type = 'button', ...props }) => {
  const className = `${styles.button} ${styles[variant]}`;
  const isExternal = typeof to === 'string' && (/^https?:\/\//.test(to) || to.startsWith('mailto:'));
  const content = (
    <>
      {icon}
      <span>{children}</span>
    </>
  );

  if (to) {
    if (isExternal) {
      return (
        <a className={className} href={to} {...props}>
          {content}
        </a>
      );
    }

    return (
      <Link className={className} to={to} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button className={className} type={type} {...props}>
      {content}
    </button>
  );
};

export default Button;
