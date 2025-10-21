import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IInvestment } from '../investment.model';
import { InvestmentService } from '../service/investment.service';
import { InvestmentFormGroup, InvestmentFormService } from './investment-form.service';

@Component({
  selector: 'jhi-investment-update',
  templateUrl: './investment-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class InvestmentUpdateComponent implements OnInit {
  isSaving = false;
  investment: IInvestment | null = null;

  protected investmentService = inject(InvestmentService);
  protected investmentFormService = inject(InvestmentFormService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: InvestmentFormGroup = this.investmentFormService.createInvestmentFormGroup();

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ investment }) => {
      this.investment = investment;
      if (investment) {
        this.updateForm(investment);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const investment = this.investmentFormService.getInvestment(this.editForm);
    if (investment.id !== null) {
      this.subscribeToSaveResponse(this.investmentService.update(investment));
    } else {
      this.subscribeToSaveResponse(this.investmentService.create(investment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInvestment>>): void {
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

  protected updateForm(investment: IInvestment): void {
    this.investment = investment;
    this.investmentFormService.resetForm(this.editForm, investment);
  }
}
