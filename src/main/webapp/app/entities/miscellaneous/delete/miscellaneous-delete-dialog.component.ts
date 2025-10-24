import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IMiscellaneous } from '../miscellaneous.model';
import { MiscellaneousService } from '../service/miscellaneous.service';

@Component({
  templateUrl: './miscellaneous-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MiscellaneousDeleteDialogComponent {
  miscellaneous?: IMiscellaneous;

  protected miscellaneousService = inject(MiscellaneousService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.miscellaneousService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
