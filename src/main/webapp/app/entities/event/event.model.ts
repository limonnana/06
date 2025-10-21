import dayjs from 'dayjs/esm';

export interface IEvent {
  id: number;
  saldo?: number | null;
  amount?: number | null;
  description?: string | null;
  dateOfEvent?: dayjs.Dayjs | null;
}

export type NewEvent = Omit<IEvent, 'id'> & { id: null };
