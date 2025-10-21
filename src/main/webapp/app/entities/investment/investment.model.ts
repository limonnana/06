import dayjs from 'dayjs/esm';

export interface IInvestment {
  id: number;
  startDate?: dayjs.Dayjs | null;
  startAmount?: number | null;
  currentValue?: number | null;
  description?: string | null;
}

export type NewInvestment = Omit<IInvestment, 'id'> & { id: null };
