import { useCallback, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Input, Typography, Spin, Empty, Result, Button } from 'antd';
import { CalendarOutlined, ReloadOutlined } from '@ant-design/icons';

import { formatDate } from '@/utils';
import { getEvents, type dtos } from '@/api';

import styles from './index.module.scss';

// Добавляем собственную реализацию хука useDebounce
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<dtos.EventsDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Получаем значение поиска из URL при первой загрузке
  const [search, setSearch] = useState<string>(
    searchParams.get('search') || '',
  );
  const debouncedSearch = useDebounce(search, 250);

  const fetchEvents = useCallback(async (searchQuery?: string) => {
    setLoading(true);
    setError(false);

    try {
      const eventsData = await getEvents(searchQuery);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // Обновляем URL при изменении поискового запроса
  useEffect(() => {
    if (debouncedSearch) {
      setSearchParams({ search: debouncedSearch });
    } else {
      setSearchParams({});
    }
  }, [debouncedSearch, setSearchParams]);

  // Загрузка данных при изменении поискового запроса
  useEffect(() => {
    fetchEvents(debouncedSearch);
  }, [fetchEvents, debouncedSearch]);

  // Обработчик поиска
  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  if (error) {
    return (
      <Result
        status="error"
        title="Упс! Что-то пошло не так"
        subTitle="Не удалось загрузить мероприятия"
        extra={
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => fetchEvents(debouncedSearch)}
          >
            Попробовать снова
          </Button>
        }
      />
    );
  }

  return (
    <div className={styles.container}>
      <Input
        placeholder="Поиск мероприятий..."
        value={search}
        onChange={({ target: { value } }) => handleSearch(value)}
        size="large"
        allowClear
        disabled={loading || error}
      />

      <div className={styles.events}>
        <Typography.Title level={3}>
          {search ? 'Результаты поиска' : 'Все мероприятия'}
        </Typography.Title>

        {loading ? (
          <div className={styles.loading}>
            <Spin size="large" />
            <Typography.Text type="secondary">
              {search ? 'Поиск мероприятий...' : 'Загрузка мероприятий...'}
            </Typography.Text>
          </div>
        ) : (
          <>
            <div className={styles.list}>
              {events.map(({ id, title, description, date }) => (
                <div key={id} className={styles.card}>
                  <div className={styles.header}>
                    <Typography.Title level={5}>{title}</Typography.Title>
                    <Typography.Text type="secondary">
                      <CalendarOutlined style={{ marginRight: 8 }} />
                      {formatDate(date)}
                    </Typography.Text>
                  </div>
                  <div className={styles.content}>{description}</div>
                  <div className={styles.footer}>
                    <span>ID: {id}</span>
                  </div>
                </div>
              ))}
            </div>

            {events.length === 0 && !loading && (
              <Empty
                description={search ? 'Ничего не найдено' : 'Нет мероприятий'}
                className={styles.empty}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
