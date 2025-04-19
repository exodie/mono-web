import type { FC } from 'react';
import { useNavigate } from 'react-router';
import { Button, Typography } from 'antd';

import styles from './index.module.scss';

export const NotFound: FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Typography.Title>Страница не найдена</Typography.Title>
      <Button onClick={() => navigate('/')}>На главную</Button>
    </div>
  );
};
