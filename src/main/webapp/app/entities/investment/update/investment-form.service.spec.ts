import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../investment.test-samples';

import { InvestmentFormService } from './investment-form.service';

describe('Investment Form Service', () => {
  let service: InvestmentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvestmentFormService);
  });

  describe('Service methods', () => {
    describe('createInvestmentFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInvestmentFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startDate: expect.any(Object),
            startAmount: expect.any(Object),
            currentValue: expect.any(Object),
            description: expect.any(Object),
          }),
        );
      });

      it('passing IInvestment should create a new form with FormGroup', () => {
        const formGroup = service.createInvestmentFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            startDate: expect.any(Object),
            startAmount: expect.any(Object),
            currentValue: expect.any(Object),
            description: expect.any(Object),
          }),
        );
      });
    });

    describe('getInvestment', () => {
      it('should return NewInvestment for default Investment initial value', () => {
        const formGroup = service.createInvestmentFormGroup(sampleWithNewData);

        const investment = service.getInvestment(formGroup) as any;

        expect(investment).toMatchObject(sampleWithNewData);
      });

      it('should return NewInvestment for empty Investment initial value', () => {
        const formGroup = service.createInvestmentFormGroup();

        const investment = service.getInvestment(formGroup) as any;

        expect(investment).toMatchObject({});
      });

      it('should return IInvestment', () => {
        const formGroup = service.createInvestmentFormGroup(sampleWithRequiredData);

        const investment = service.getInvestment(formGroup) as any;

        expect(investment).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInvestment should not enable id FormControl', () => {
        const formGroup = service.createInvestmentFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInvestment should disable id FormControl', () => {
        const formGroup = service.createInvestmentFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
