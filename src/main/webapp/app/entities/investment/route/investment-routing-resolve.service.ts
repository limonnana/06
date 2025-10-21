import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInvestment } from '../investment.model';
import { InvestmentService } from '../service/investment.service';

const investmentResolve = (route: ActivatedRouteSnapshot): Observable<null | IInvestment> => {
  const id = route.params.id;
  if (id) {
    return inject(InvestmentService)
      .find(id)
      .pipe(
        mergeMap((investment: HttpResponse<IInvestment>) => {
          if (investment.body) {
            return of(investment.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default investmentResolve;
