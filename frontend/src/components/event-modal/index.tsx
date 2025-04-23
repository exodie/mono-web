import React from 'react';
import { Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { EventsType } from '@/types';
import { RootState, AppDispatch } from '@/store';
import { createNewEvent, updateExistingEvent } from '@/store/thunks';
import EventForm, { EventFormData } from '../event-form';

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  event?: EventsType;
}

export const EventModal: React.FC<EventModalProps> = ({
  open,
  onClose,
  event,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.events);
  const { data: userData } = useSelector((state: RootState) => state.user);

  const handleSubmit = async (data: EventFormData) => {
    if (!userData?.id) return;

    try {
      if (event) {
        await dispatch(
          updateExistingEvent({
            id: event.id,
            data: {
              title: data.title,
              description: data.description,
              date: data.date.toISOString(),
            },
          }),
        ).unwrap();
      } else {
        await dispatch(
          createNewEvent({
            title: data.title,
            description: data.description,
            date: data.date.toISOString(),
            createdBy: userData.id,
          }),
        ).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={event ? 'Редактировать мероприятие' : 'Создать мероприятие'}
      footer={null}
    >
      <EventForm
        initialData={event}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </Modal>
  );
};
