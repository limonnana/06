import { Component, NgZone, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, combineLatest, filter, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { SortByDirective, SortDirective, SortService, type SortState, sortStateSignal } from 'app/shared/sort';
import { FormatMediumDatePipe } from 'app/shared/date';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SORT_DATA, ITEM_DELETED_EVENT, SORT } from 'app/config/navigation.constants';
import { IInvestment } from '../investment.model';
import { EntityArrayResponseType, InvestmentService } from '../service/investment.service';
import { InvestmentDeleteDialogComponent } from '../delete/investment-delete-dialog.component';

@Component({
  selector: 'jhi-investment',
  templateUrl: './investment.component.html',
  styleUrl: './investment.scss',
  imports: [RouterModule, FormsModule, SharedModule, SortDirective, SortByDirective, FormatMediumDatePipe],
})
export class InvestmentComponent implements OnInit {
  subscription: Subscription | null = null;
  investments = signal<IInvestment[]>([]);
  isLoading = false;
  total: number | null | undefined;

  sortState = sortStateSignal({});

  public readonly router = inject(Router);
  protected readonly investmentService = inject(InvestmentService);
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly sortService = inject(SortService);
  protected modalService = inject(NgbModal);
  protected ngZone = inject(NgZone);

  trackId = (item: IInvestment): number => this.investmentService.getInvestmentIdentifier(item);

  ngOnInit(): void {
    this.subscription = combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data])
      .pipe(
        tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
        tap(() => {
          if (this.investments().length === 0) {
            this.load();
          } else {
            this.investments.set(this.refineData(this.investments()));
          }
        }),
      )
      .subscribe();
    this.getTotal();
  }

  delete(investment: IInvestment): void {
    const modalRef = this.modalService.open(InvestmentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.investment = investment;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => this.load()),
      )
      .subscribe();
  }

  load(): void {
    this.queryBackend().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  getTotal(): void {
    this.investmentService.total().subscribe({
      next: response => {
        console.log('Total response:', response);
        this.total = response.body?.total;
        console.log('Total :', this.total);
      },
      error: error => console.error('Error:', error),
    });
  }

  navigateToWithComponentValues(event: SortState): void {
    this.handleNavigation(event);
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    this.sortState.set(this.sortService.parseSortParam(params.get(SORT) ?? data[DEFAULT_SORT_DATA]));
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.investments.set(this.refineData(dataFromBody));
  }

  protected refineData(data: IInvestment[]): IInvestment[] {
    const { predicate, order } = this.sortState();
    return predicate && order ? data.sort(this.sortService.startSort({ predicate, order })) : data;
  }

  protected fillComponentAttributesFromResponseBody(data: IInvestment[] | null): IInvestment[] {
    return data ?? [];
  }

  protected queryBackend(): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject: any = {
      sort: this.sortService.buildSortParam(this.sortState()),
    };
    return this.investmentService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(sortState: SortState): void {
    const queryParamsObj = {
      sort: this.sortService.buildSortParam(sortState),
    };

    this.ngZone.run(() => {
      this.router.navigate(['./'], {
        relativeTo: this.activatedRoute,
        queryParams: queryParamsObj,
      });
    });
  }
}
