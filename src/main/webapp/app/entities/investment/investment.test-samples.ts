import dayjs from 'dayjs/esm';

import { IInvestment, NewInvestment } from './investment.model';

export const sampleWithRequiredData: IInvestment = {
  id: 18893,
  startDate: dayjs('2025-10-14'),
  startAmount: 18082.23,
  currentValue: 16386.53,
};

export const sampleWithPartialData: IInvestment = {
  id: 3066,
  startDate: dayjs('2025-10-14'),
  startAmount: 11578.96,
  currentValue: 1982.97,
  description: 'mainstream',
};

export const sampleWithFullData: IInvestment = {
  id: 20614,
  startDate: dayjs('2025-10-14'),
  startAmount: 5403.98,
  currentValue: 14268.03,
  description: 'exactly per',
};

export const sampleWithNewData: NewInvestment = {
  startDate: dayjs('2025-10-13'),
  startAmount: 32717.76,
  currentValue: 32440.98,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
