export type EventsType = {
  id: number;
  title: string;
  description: string;
  createdBy: number;
  createdAt: string;
};

export interface EventsState {
  data: EventsType[];
  isLoading: boolean;
  error: string | null;
}
