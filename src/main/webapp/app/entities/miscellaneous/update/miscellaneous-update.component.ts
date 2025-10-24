import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IMiscellaneous } from '../miscellaneous.model';
import { MiscellaneousService } from '../service/miscellaneous.service';
import { MiscellaneousFormGroup, MiscellaneousFormService } from './miscellaneous-form.service';

@Component({
  selector: 'jhi-miscellaneous-update',
  templateUrl: './miscellaneous-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class MiscellaneousUpdateComponent implements OnInit {
  isSaving = false;
  miscellaneous: IMiscellaneous | null = null;

  protected miscellaneousService = inject(MiscellaneousService);
  protected miscellaneousFormService = inject(MiscellaneousFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: MiscellaneousFormGroup = this.miscellaneousFormService.createMiscellaneousFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ miscellaneous }) => {
      this.miscellaneous = miscellaneous;
      if (miscellaneous) {
        this.updateForm(miscellaneous);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const miscellaneous = this.miscellaneousFormService.getMiscellaneous(this.editForm);
    if (miscellaneous.id !== null) {
      this.subscribeToSaveResponse(this.miscellaneousService.update(miscellaneous));
    } else {
      this.subscribeToSaveResponse(this.miscellaneousService.create(miscellaneous));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMiscellaneous>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(miscellaneous: IMiscellaneous): void {
    this.miscellaneous = miscellaneous;
    this.miscellaneousFormService.resetForm(this.editForm, miscellaneous);
  }
}
