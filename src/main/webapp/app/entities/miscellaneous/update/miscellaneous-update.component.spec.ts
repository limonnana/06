import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { MiscellaneousService } from '../service/miscellaneous.service';
import { IMiscellaneous } from '../miscellaneous.model';
import { MiscellaneousFormService } from './miscellaneous-form.service';

import { MiscellaneousUpdateComponent } from './miscellaneous-update.component';

describe('Miscellaneous Management Update Component', () => {
  let comp: MiscellaneousUpdateComponent;
  let fixture: ComponentFixture<MiscellaneousUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let miscellaneousFormService: MiscellaneousFormService;
  let miscellaneousService: MiscellaneousService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MiscellaneousUpdateComponent],
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
      .overrideTemplate(MiscellaneousUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MiscellaneousUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    miscellaneousFormService = TestBed.inject(MiscellaneousFormService);
    miscellaneousService = TestBed.inject(MiscellaneousService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const miscellaneous: IMiscellaneous = { id: 30689 };

      activatedRoute.data = of({ miscellaneous });
      comp.ngOnInit();

      expect(comp.miscellaneous).toEqual(miscellaneous);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMiscellaneous>>();
      const miscellaneous = { id: 11098 };
      jest.spyOn(miscellaneousFormService, 'getMiscellaneous').mockReturnValue(miscellaneous);
      jest.spyOn(miscellaneousService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ miscellaneous });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: miscellaneous }));
      saveSubject.complete();

      // THEN
      expect(miscellaneousFormService.getMiscellaneous).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(miscellaneousService.update).toHaveBeenCalledWith(expect.objectContaining(miscellaneous));
      expect(comp.isSaving).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMiscellaneous>>();
      const miscellaneous = { id: 11098 };
      jest.spyOn(miscellaneousFormService, 'getMiscellaneous').mockReturnValue({ id: null });
      jest.spyOn(miscellaneousService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ miscellaneous: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: miscellaneous }));
      saveSubject.complete();

      // THEN
      expect(miscellaneousFormService.getMiscellaneous).toHaveBeenCalled();
      expect(miscellaneousService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IMiscellaneous>>();
      const miscellaneous = { id: 11098 };
      jest.spyOn(miscellaneousService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ miscellaneous });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(miscellaneousService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
