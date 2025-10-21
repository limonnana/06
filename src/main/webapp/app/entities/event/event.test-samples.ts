import dayjs from 'dayjs/esm';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 18174,
  saldo: 17724.73,
  amount: 7814.88,
  dateOfEvent: dayjs('2025-10-05'),
};

export const sampleWithPartialData: IEvent = {
  id: 4844,
  saldo: 30735.6,
  amount: 32195.98,
  dateOfEvent: dayjs('2025-10-06'),
};

export const sampleWithFullData: IEvent = {
  id: 14744,
  saldo: 17234.4,
  amount: 7781.33,
  description: 'likewise beside of',
  dateOfEvent: dayjs('2025-10-05'),
};

export const sampleWithNewData: NewEvent = {
  saldo: 30119.27,
  amount: 5936.26,
  dateOfEvent: dayjs('2025-10-06'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
