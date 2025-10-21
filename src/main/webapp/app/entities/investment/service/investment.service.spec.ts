import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IInvestment } from '../investment.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../investment.test-samples';

import { InvestmentService, RestInvestment } from './investment.service';

const requireRestSample: RestInvestment = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.format(DATE_FORMAT),
};

describe('Investment Service', () => {
  let service: InvestmentService;
  let httpMock: HttpTestingController;
  let expectedResult: IInvestment | IInvestment[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(InvestmentService);
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

    it('should create a Investment', () => {
      const investment = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(investment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Investment', () => {
      const investment = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(investment).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Investment', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Investment', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Investment', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addInvestmentToCollectionIfMissing', () => {
      it('should add a Investment to an empty array', () => {
        const investment: IInvestment = sampleWithRequiredData;
        expectedResult = service.addInvestmentToCollectionIfMissing([], investment);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(investment);
      });

      it('should not add a Investment to an array that contains it', () => {
        const investment: IInvestment = sampleWithRequiredData;
        const investmentCollection: IInvestment[] = [
          {
            ...investment,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInvestmentToCollectionIfMissing(investmentCollection, investment);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Investment to an array that doesn't contain it", () => {
        const investment: IInvestment = sampleWithRequiredData;
        const investmentCollection: IInvestment[] = [sampleWithPartialData];
        expectedResult = service.addInvestmentToCollectionIfMissing(investmentCollection, investment);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(investment);
      });

      it('should add only unique Investment to an array', () => {
        const investmentArray: IInvestment[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const investmentCollection: IInvestment[] = [sampleWithRequiredData];
        expectedResult = service.addInvestmentToCollectionIfMissing(investmentCollection, ...investmentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const investment: IInvestment = sampleWithRequiredData;
        const investment2: IInvestment = sampleWithPartialData;
        expectedResult = service.addInvestmentToCollectionIfMissing([], investment, investment2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(investment);
        expect(expectedResult).toContain(investment2);
      });

      it('should accept null and undefined values', () => {
        const investment: IInvestment = sampleWithRequiredData;
        expectedResult = service.addInvestmentToCollectionIfMissing([], null, investment, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(investment);
      });

      it('should return initial array if no Investment is added', () => {
        const investmentCollection: IInvestment[] = [sampleWithRequiredData];
        expectedResult = service.addInvestmentToCollectionIfMissing(investmentCollection, undefined, null);
        expect(expectedResult).toEqual(investmentCollection);
      });
    });

    describe('compareInvestment', () => {
      it('should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInvestment(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('should return false if one entity is null', () => {
        const entity1 = { id: 3414 };
        const entity2 = null;

        const compareResult1 = service.compareInvestment(entity1, entity2);
        const compareResult2 = service.compareInvestment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey differs', () => {
        const entity1 = { id: 3414 };
        const entity2 = { id: 28016 };

        const compareResult1 = service.compareInvestment(entity1, entity2);
        const compareResult2 = service.compareInvestment(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('should return false if primaryKey matches', () => {
        const entity1 = { id: 3414 };
        const entity2 = { id: 3414 };

        const compareResult1 = service.compareInvestment(entity1, entity2);
        const compareResult2 = service.compareInvestment(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
