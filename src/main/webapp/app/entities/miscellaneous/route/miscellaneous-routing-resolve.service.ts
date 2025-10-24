import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMiscellaneous } from '../miscellaneous.model';
import { MiscellaneousService } from '../service/miscellaneous.service';

const miscellaneousResolve = (route: ActivatedRouteSnapshot): Observable<null | IMiscellaneous> => {
  const id = route.params.id;
  if (id) {
    return inject(MiscellaneousService)
      .find(id)
      .pipe(
        mergeMap((miscellaneous: HttpResponse<IMiscellaneous>) => {
          if (miscellaneous.body) {
            return of(miscellaneous.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default miscellaneousResolve;
