import dayjs from 'dayjs/esm';

export interface IMiscellaneous {
  id: number;
  lastUpdate?: dayjs.Dayjs | null;
}

export type NewMiscellaneous = Omit<IMiscellaneous, 'id'> & { id: null };
