import { useNavigate } from 'react-router';
import { Button, Space, Typography } from 'antd';

import EventsImage from './assets/events.svg';
import styles from './index.module.scss';

const { Title, Paragraph } = Typography;

export const App = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.textBlock}>
          <Title level={1}>Добро пожаловать в наше приложение!</Title>
          <Paragraph className={styles.description}>
            Организуйте и участвуйте в мероприятиях вместе с нами. Создавайте
            незабываемые встречи и находите единомышленников для ваших
            интересов.
          </Paragraph>
          <Space size="large" className={styles.actions}>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/events')}
            >
              Смотреть мероприятия
            </Button>
          </Space>
        </div>
        <div className={styles.imageBlock}>
          <img src={EventsImage} alt="Events illustration" />
        </div>
      </div>
    </div>
  );
};
