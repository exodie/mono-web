import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Typography,
  Card,
  Row,
  Col,
  Spin,
  Button,
  Grid,
  Form,
  Input,
  DatePicker,
  Select,
  message,
} from 'antd';
import { PlusOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { RootState, AppDispatch } from '@/store';
import dayjs from 'dayjs';
import { fetchUser, updateUser, fetchAllEvents } from '@/store/thunks';
import { EventModal, UserDataDisplay } from '@/components';
import { EventsType, User } from '@/types';
import type { UpdateProfileDto } from '@/api/dto';
import styles from './index.module.scss';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export const Account: React.FC = () => {
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useSelector((state: RootState) => state.user);
  const {
    data: events,
    isLoading: isEventsLoading,
    error: eventsError,
  } = useSelector((state: RootState) => state.events);
  const dispatch = useDispatch<AppDispatch>();
  const screens = useBreakpoint();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventsType | undefined>(
    undefined,
  );
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchAllEvents());
  }, [dispatch]);

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        firstName: userData.firstName,
        lastName: userData.lastName,
        middleName: userData.middleName,
        gender: userData.gender,
        birthDate: userData.birthDate ? dayjs(userData.birthDate) : undefined,
      });
    }
  }, [userData, form]);

  const handleCreateClick = () => {
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (event: EventsType) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(undefined);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const values = await form.validateFields();
      const updateData: UpdateProfileDto = {
        ...values,
        birthDate: values.birthDate?.format('YYYY-MM-DD'),
      };

      await dispatch(updateUser(updateData)).unwrap();
      setIsEditing(false);
      message.success('Профиль успешно обновлен');
    } catch {
      message.error('Ошибка при сохранении профиля');
    }
  };

  if (isUserLoading || isEventsLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (userError || eventsError) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Text type="danger">{userError || eventsError}</Text>
      </div>
    );
  }

  if (!userData?.email) {
    return null;
  }

  const userEvents = events.filter(
    (event: EventsType) => event.createdBy === userData.id,
  );

  const adaptiveHeader = classNames(styles.header, {
    [styles.headerDesktop]: screens.sm,
    [styles.headerMobile]: !screens.sm,
  });

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: '24px' }}>
        <div className={adaptiveHeader}>
          <Title level={2}>Профиль</Title>
          <Button
            type="primary"
            icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
            onClick={isEditing ? handleSaveProfile : handleEditProfile}
          >
            {isEditing ? 'Сохранить' : 'Редактировать'}
          </Button>
        </div>
        {isEditing ? (
          <Form form={form} layout="vertical">
            <Form.Item
              name="firstName"
              label="Имя"
              rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Фамилия"
              rules={[
                { required: true, message: 'Пожалуйста, введите фамилию' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="middleName" label="Отчество">
              <Input />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Пол"
              rules={[{ required: true, message: 'Пожалуйста, выберите пол' }]}
            >
              <Select>
                <Select.Option value="male">Мужской</Select.Option>
                <Select.Option value="female">Женский</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="birthDate"
              label="Дата рождения"
              rules={[
                {
                  required: true,
                  message: 'Пожалуйста, выберите дату рождения',
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
          </Form>
        ) : (
          <UserDataDisplay data={userData as User} />
        )}
      </Card>

      <div className={adaptiveHeader}>
        <Title level={3} style={{ margin: 0 }}>
          Мои мероприятия
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateClick}
        >
          Создать мероприятие
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {userEvents.map((event: EventsType) => (
          <Col key={event.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              title={event.title}
              extra={
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => handleEditClick(event)}
                >
                  Редактировать
                </Button>
              }
            >
              <p>{event.description}</p>
              <Text type="secondary">Дата: {event.createdAt}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      <EventModal
        open={isModalOpen}
        onClose={handleModalClose}
        event={selectedEvent}
      />
    </div>
  );
};
