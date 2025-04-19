import { useMemo } from 'react';
import { Link } from 'react-router';
import { Button } from 'antd';
import Cookies from 'js-cookie';

import { AUTH_LABEL, EVENTS_LABEL, ROUTES } from '@/constants';

import styles from './index.module.scss';

export const Header = () => {
  const isAuthenticated = useMemo(() => Cookies.get('token'), []);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to={ROUTES.HOME} className={styles.logo}>
          {EVENTS_LABEL}
        </Link>

        <Link to={isAuthenticated ? ROUTES.ACCOUNT : ROUTES.AUTH}>
          <Button type="primary">
            {isAuthenticated ? 'Аккаунт' : AUTH_LABEL}
          </Button>
        </Link>
      </nav>
    </header>
  );
};
