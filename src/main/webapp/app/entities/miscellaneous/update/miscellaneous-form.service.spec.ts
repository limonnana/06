import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../miscellaneous.test-samples';

import { MiscellaneousFormService } from './miscellaneous-form.service';

describe('Miscellaneous Form Service', () => {
  let service: MiscellaneousFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiscellaneousFormService);
  });

  describe('Service methods', () => {
    describe('createMiscellaneousFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createMiscellaneousFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            lastUpdate: expect.any(Object),
          }),
        );
      });

      it('passing IMiscellaneous should create a new form with FormGroup', () => {
        const formGroup = service.createMiscellaneousFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            lastUpdate: expect.any(Object),
          }),
        );
      });
    });

    describe('getMiscellaneous', () => {
      it('should return NewMiscellaneous for default Miscellaneous initial value', () => {
        const formGroup = service.createMiscellaneousFormGroup(sampleWithNewData);

        const miscellaneous = service.getMiscellaneous(formGroup) as any;

        expect(miscellaneous).toMatchObject(sampleWithNewData);
      });

      it('should return NewMiscellaneous for empty Miscellaneous initial value', () => {
        const formGroup = service.createMiscellaneousFormGroup();

        const miscellaneous = service.getMiscellaneous(formGroup) as any;

        expect(miscellaneous).toMatchObject({});
      });

      it('should return IMiscellaneous', () => {
        const formGroup = service.createMiscellaneousFormGroup(sampleWithRequiredData);

        const miscellaneous = service.getMiscellaneous(formGroup) as any;

        expect(miscellaneous).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IMiscellaneous should not enable id FormControl', () => {
        const formGroup = service.createMiscellaneousFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewMiscellaneous should disable id FormControl', () => {
        const formGroup = service.createMiscellaneousFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
