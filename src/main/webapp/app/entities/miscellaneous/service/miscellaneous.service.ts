import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMiscellaneous, NewMiscellaneous } from '../miscellaneous.model';

export type PartialUpdateMiscellaneous = Partial<IMiscellaneous> & Pick<IMiscellaneous, 'id'>;

type RestOf<T extends IMiscellaneous | NewMiscellaneous> = Omit<T, 'lastUpdate'> & {
  lastUpdate?: string | null;
};

export type RestMiscellaneous = RestOf<IMiscellaneous>;

export type NewRestMiscellaneous = RestOf<NewMiscellaneous>;

export type PartialUpdateRestMiscellaneous = RestOf<PartialUpdateMiscellaneous>;

export type EntityResponseType = HttpResponse<IMiscellaneous>;
export type EntityArrayResponseType = HttpResponse<IMiscellaneous[]>;

@Injectable({ providedIn: 'root' })
export class MiscellaneousService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/miscellaneous');

  create(miscellaneous: NewMiscellaneous): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(miscellaneous);
    return this.http
      .post<RestMiscellaneous>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(miscellaneous: IMiscellaneous): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(miscellaneous);
    return this.http
      .put<RestMiscellaneous>(`${this.resourceUrl}/${this.getMiscellaneousIdentifier(miscellaneous)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(miscellaneous: PartialUpdateMiscellaneous): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(miscellaneous);
    return this.http
      .patch<RestMiscellaneous>(`${this.resourceUrl}/${this.getMiscellaneousIdentifier(miscellaneous)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMiscellaneous>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMiscellaneous[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMiscellaneousIdentifier(miscellaneous: Pick<IMiscellaneous, 'id'>): number {
    return miscellaneous.id;
  }

  compareMiscellaneous(o1: Pick<IMiscellaneous, 'id'> | null, o2: Pick<IMiscellaneous, 'id'> | null): boolean {
    return o1 && o2 ? this.getMiscellaneousIdentifier(o1) === this.getMiscellaneousIdentifier(o2) : o1 === o2;
  }

  addMiscellaneousToCollectionIfMissing<Type extends Pick<IMiscellaneous, 'id'>>(
    miscellaneousCollection: Type[],
    ...miscellaneousToCheck: (Type | null | undefined)[]
  ): Type[] {
    const miscellaneous: Type[] = miscellaneousToCheck.filter(isPresent);
    if (miscellaneous.length > 0) {
      const miscellaneousCollectionIdentifiers = miscellaneousCollection.map(miscellaneousItem =>
        this.getMiscellaneousIdentifier(miscellaneousItem),
      );
      const miscellaneousToAdd = miscellaneous.filter(miscellaneousItem => {
        const miscellaneousIdentifier = this.getMiscellaneousIdentifier(miscellaneousItem);
        if (miscellaneousCollectionIdentifiers.includes(miscellaneousIdentifier)) {
          return false;
        }
        miscellaneousCollectionIdentifiers.push(miscellaneousIdentifier);
        return true;
      });
      return [...miscellaneousToAdd, ...miscellaneousCollection];
    }
    return miscellaneousCollection;
  }

  protected convertDateFromClient<T extends IMiscellaneous | NewMiscellaneous | PartialUpdateMiscellaneous>(miscellaneous: T): RestOf<T> {
    return {
      ...miscellaneous,
      lastUpdate: miscellaneous.lastUpdate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restMiscellaneous: RestMiscellaneous): IMiscellaneous {
    return {
      ...restMiscellaneous,
      lastUpdate: restMiscellaneous.lastUpdate ? dayjs(restMiscellaneous.lastUpdate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMiscellaneous>): HttpResponse<IMiscellaneous> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMiscellaneous[]>): HttpResponse<IMiscellaneous[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
