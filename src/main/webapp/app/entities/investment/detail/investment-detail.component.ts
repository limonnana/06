import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatePipe } from 'app/shared/date';
import { IInvestment } from '../investment.model';

@Component({
  selector: 'jhi-investment-detail',
  templateUrl: './investment-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatePipe],
})
export class InvestmentDetailComponent {
  investment = input<IInvestment | null>(null);

  previousState(): void {
    window.history.back();
  }
}
