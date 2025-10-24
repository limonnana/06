import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IMiscellaneous, NewMiscellaneous } from '../miscellaneous.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMiscellaneous for edit and NewMiscellaneousFormGroupInput for create.
 */
type MiscellaneousFormGroupInput = IMiscellaneous | PartialWithRequiredKeyOf<NewMiscellaneous>;

type MiscellaneousFormDefaults = Pick<NewMiscellaneous, 'id'>;

type MiscellaneousFormGroupContent = {
  id: FormControl<IMiscellaneous['id'] | NewMiscellaneous['id']>;
  lastUpdate: FormControl<IMiscellaneous['lastUpdate']>;
};

export type MiscellaneousFormGroup = FormGroup<MiscellaneousFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MiscellaneousFormService {
  createMiscellaneousFormGroup(miscellaneous: MiscellaneousFormGroupInput = { id: null }): MiscellaneousFormGroup {
    const miscellaneousRawValue = {
      ...this.getFormDefaults(),
      ...miscellaneous,
    };
    return new FormGroup<MiscellaneousFormGroupContent>({
      id: new FormControl(
        { value: miscellaneousRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      lastUpdate: new FormControl(miscellaneousRawValue.lastUpdate, {
        validators: [Validators.required],
      }),
    });
  }

  getMiscellaneous(form: MiscellaneousFormGroup): IMiscellaneous | NewMiscellaneous {
    return form.getRawValue() as IMiscellaneous | NewMiscellaneous;
  }

  resetForm(form: MiscellaneousFormGroup, miscellaneous: MiscellaneousFormGroupInput): void {
    const miscellaneousRawValue = { ...this.getFormDefaults(), ...miscellaneous };
    form.reset(
      {
        ...miscellaneousRawValue,
        id: { value: miscellaneousRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MiscellaneousFormDefaults {
    return {
      id: null,
    };
  }
}
