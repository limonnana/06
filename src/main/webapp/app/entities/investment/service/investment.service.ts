import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInvestment, NewInvestment } from '../investment.model';

export type PartialUpdateInvestment = Partial<IInvestment> & Pick<IInvestment, 'id'>;

type RestOf<T extends IInvestment | NewInvestment> = Omit<T, 'startDate'> & {
  startDate?: string | null;
};

export type RestInvestment = RestOf<IInvestment>;

export type NewRestInvestment = RestOf<NewInvestment>;

export type PartialUpdateRestInvestment = RestOf<PartialUpdateInvestment>;

export type EntityResponseType = HttpResponse<IInvestment>;
export type EntityArrayResponseType = HttpResponse<IInvestment[]>;

@Injectable({ providedIn: 'root' })
export class InvestmentService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/investments');

  create(investment: NewInvestment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(investment);
    return this.http
      .post<RestInvestment>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(investment: IInvestment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(investment);
    return this.http
      .put<RestInvestment>(`${this.resourceUrl}/${this.getInvestmentIdentifier(investment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(investment: PartialUpdateInvestment): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(investment);
    return this.http
      .patch<RestInvestment>(`${this.resourceUrl}/${this.getInvestmentIdentifier(investment)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestInvestment>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestInvestment[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInvestmentIdentifier(investment: Pick<IInvestment, 'id'>): number {
    return investment.id;
  }

  compareInvestment(o1: Pick<IInvestment, 'id'> | null, o2: Pick<IInvestment, 'id'> | null): boolean {
    return o1 && o2 ? this.getInvestmentIdentifier(o1) === this.getInvestmentIdentifier(o2) : o1 === o2;
  }

  addInvestmentToCollectionIfMissing<Type extends Pick<IInvestment, 'id'>>(
    investmentCollection: Type[],
    ...investmentsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const investments: Type[] = investmentsToCheck.filter(isPresent);
    if (investments.length > 0) {
      const investmentCollectionIdentifiers = investmentCollection.map(investmentItem => this.getInvestmentIdentifier(investmentItem));
      const investmentsToAdd = investments.filter(investmentItem => {
        const investmentIdentifier = this.getInvestmentIdentifier(investmentItem);
        if (investmentCollectionIdentifiers.includes(investmentIdentifier)) {
          return false;
        }
        investmentCollectionIdentifiers.push(investmentIdentifier);
        return true;
      });
      return [...investmentsToAdd, ...investmentCollection];
    }
    return investmentCollection;
  }

  protected convertDateFromClient<T extends IInvestment | NewInvestment | PartialUpdateInvestment>(investment: T): RestOf<T> {
    return {
      ...investment,
      startDate: investment.startDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restInvestment: RestInvestment): IInvestment {
    return {
      ...restInvestment,
      startDate: restInvestment.startDate ? dayjs(restInvestment.startDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestInvestment>): HttpResponse<IInvestment> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestInvestment[]>): HttpResponse<IInvestment[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
