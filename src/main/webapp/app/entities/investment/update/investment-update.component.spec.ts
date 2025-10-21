import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { InvestmentService } from '../service/investment.service';
import { IInvestment } from '../investment.model';
import { InvestmentFormService } from './investment-form.service';

import { InvestmentUpdateComponent } from './investment-update.component';

describe('Investment Management Update Component', () => {
  let comp: InvestmentUpdateComponent;
  let fixture: ComponentFixture<InvestmentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let investmentFormService: InvestmentFormService;
  let investmentService: InvestmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InvestmentUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(InvestmentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InvestmentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    investmentFormService = TestBed.inject(InvestmentFormService);
    investmentService = TestBed.inject(InvestmentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const investment: IInvestment = { id: 28016 };

      activatedRoute.data = of({ investment });
      comp.ngOnInit();

      expect(comp.investment).toEqual(investment);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInvestment>>();
      const investment = { id: 3414 };
      jest.spyOn(investmentFormService, 'getInvestment').mockReturnValue(investment);
      jest.spyOn(investmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ investment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: investment }));
      saveSubject.complete();

      // THEN
      expect(investmentFormService.getInvestment).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(investmentService.update).toHaveBeenCalledWith(expect.objectContaining(investment));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInvestment>>();
      const investment = { id: 3414 };
      jest.spyOn(investmentFormService, 'getInvestment').mockReturnValue({ id: null });
      jest.spyOn(investmentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ investment: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: investment }));
      saveSubject.complete();

      // THEN
      expect(investmentFormService.getInvestment).toHaveBeenCalled();
      expect(investmentService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInvestment>>();
      const investment = { id: 3414 };
      jest.spyOn(investmentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ investment });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(investmentService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
