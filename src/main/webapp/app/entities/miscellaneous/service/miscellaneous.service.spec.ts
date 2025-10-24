import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IMiscellaneous } from '../miscellaneous.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../miscellaneous.test-samples';

import { MiscellaneousService, RestMiscellaneous } from './miscellaneous.service';

const requireRestSample: RestMiscellaneous = {
  ...sampleWithRequiredData,
  lastUpdate: sampleWithRequiredData.lastUpdate?.format(DATE_FORMAT),
};

describe('Miscellaneous Service', () => {
  let service: MiscellaneousService;
  let httpMock: HttpTestingController;
  let expectedResult: IMiscellaneous | IMiscellaneous[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(MiscellaneousService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Miscellaneous', () => {
      const miscellaneous = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(miscellaneous).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Miscellaneous', () => {
      const miscellaneous = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(miscellaneous).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Miscellaneous', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Miscellaneous', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Miscellaneous', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMiscellaneousToCollectionIfMissing', () => {
      it('should add a Miscellaneous to an empty array', () => {
        const miscellaneous: IMiscellaneous = sampleWithRequiredData;
        expectedResult = service.addMiscellaneousToCollectionIfMissing([], miscellaneous);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(miscellaneous);
      });

      it('should not add a Miscellaneous to an array that contains it', () => {
        const miscellaneous: IMiscellaneous = sampleWithRequiredData;
        const miscellaneousCollection: IMiscellaneous[] = [
          {
            ...miscellaneous,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMiscellaneousToCollectionIfMissing(miscellaneousCollection, miscellaneous);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Miscellaneous to an array that doesn't contain it", () => {
        const miscellaneous: IMiscellaneous = sampleWithRequiredData;
        const miscellaneousCollection: IMiscellaneous[] = [sampleWithPartialData];
        expectedResult = service.addMiscellaneousToCollectionIfMissing(miscellaneousCollection, miscellaneous);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(miscellaneous);
      });

      it('should add only unique Miscellaneous to an array', () => {
        const miscellaneousArray: IMiscellaneous[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const miscellaneousCollection: IMiscellaneous[] = [sampleWithRequiredData];
        expectedResult = service.addMiscellaneousToCollectionIfMissing(miscellaneousCollection, ...miscellaneousArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const miscellaneous: IMiscellaneous = sampleWithRequiredData;
        const miscellaneous2: IMiscellaneous = sampleWithPartialData;
        expectedResult = service.addMiscellaneousToCollectionIfMissing([], miscellaneous, miscellaneous2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(miscellaneous);
        expect(expectedResult).toContain(miscellaneous2);
      });

      it('should accept null and undefined values', () => {
        const miscellaneous: IMiscellaneous = sampleWithRequiredData;
        expectedResult = service.addMiscellaneousToCollectionIfMissing([], null, miscellaneous, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(miscellaneous);
      });

      it('should return initial array if no Miscellaneous is added', () => {
        const miscellaneousCollection: IMiscellaneous[] = [sampleWithRequiredData];
        expectedResult = service.addMiscellaneousToCollectionIfMissing(miscellaneousCollection, undefined, null);
        expect(expectedResult).toEqual(miscellaneousCollection);
      });
    });

    describe('compareMiscellaneous', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMiscellaneous(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 11098 };
        const entity2 = null;

        const compareResult1 = service.compareMiscellaneous(entity1, entity2);
        const compareResult2 = service.compareMiscellaneous(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 11098 };
        const entity2 = { id: 30689 };

        const compareResult1 = service.compareMiscellaneous(entity1, entity2);
        const compareResult2 = service.compareMiscellaneous(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 11098 };
        const entity2 = { id: 11098 };

        const compareResult1 = service.compareMiscellaneous(entity1, entity2);
        const compareResult2 = service.compareMiscellaneous(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
