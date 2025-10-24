import dayjs from 'dayjs/esm';

import { IMiscellaneous, NewMiscellaneous } from './miscellaneous.model';

export const sampleWithRequiredData: IMiscellaneous = {
  id: 16039,
  lastUpdate: dayjs('2025-10-24'),
};

export const sampleWithPartialData: IMiscellaneous = {
  id: 16582,
  lastUpdate: dayjs('2025-10-24'),
};

export const sampleWithFullData: IMiscellaneous = {
  id: 20123,
  lastUpdate: dayjs('2025-10-23'),
};

export const sampleWithNewData: NewMiscellaneous = {
  lastUpdate: dayjs('2025-10-24'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
