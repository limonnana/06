import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IInvestment, NewInvestment } from '../investment.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInvestment for edit and NewInvestmentFormGroupInput for create.
 */
type InvestmentFormGroupInput = IInvestment | PartialWithRequiredKeyOf<NewInvestment>;

type InvestmentFormDefaults = Pick<NewInvestment, 'id'>;

type InvestmentFormGroupContent = {
  id: FormControl<IInvestment['id'] | NewInvestment['id']>;
  startDate: FormControl<IInvestment['startDate']>;
  startAmount: FormControl<IInvestment['startAmount']>;
  currentValue: FormControl<IInvestment['currentValue']>;
  description: FormControl<IInvestment['description']>;
};

export type InvestmentFormGroup = FormGroup<InvestmentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InvestmentFormService {
  createInvestmentFormGroup(investment: InvestmentFormGroupInput = { id: null }): InvestmentFormGroup {
    const investmentRawValue = {
      ...this.getFormDefaults(),
      ...investment,
    };
    return new FormGroup<InvestmentFormGroupContent>({
      id: new FormControl(
        { value: investmentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      startDate: new FormControl(investmentRawValue.startDate, {
        validators: [Validators.required],
      }),
      startAmount: new FormControl(investmentRawValue.startAmount, {
        validators: [Validators.required],
      }),
      currentValue: new FormControl(investmentRawValue.currentValue, {
        validators: [Validators.required],
      }),
      description: new FormControl(investmentRawValue.description),
    });
  }

  getInvestment(form: InvestmentFormGroup): IInvestment | NewInvestment {
    return form.getRawValue() as IInvestment | NewInvestment;
  }

  resetForm(form: InvestmentFormGroup, investment: InvestmentFormGroupInput): void {
    const investmentRawValue = { ...this.getFormDefaults(), ...investment };
    form.reset(
      {
        ...investmentRawValue,
        id: { value: investmentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): InvestmentFormDefaults {
    return {
      id: null,
    };
  }
}
