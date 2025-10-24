import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { FormatMediumDatePipe } from 'app/shared/date';
import { IMiscellaneous } from '../miscellaneous.model';

@Component({
  selector: 'jhi-miscellaneous-detail',
  templateUrl: './miscellaneous-detail.component.html',
  imports: [SharedModule, RouterModule, FormatMediumDatePipe],
})
export class MiscellaneousDetailComponent {
  miscellaneous = input<IMiscellaneous | null>(null);

  previousState(): void {
    window.history.back();
  }
}
