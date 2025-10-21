import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { InvestmentDetailComponent } from './investment-detail.component';

describe('Investment Management Detail Component', () => {
  let comp: InvestmentDetailComponent;
  let fixture: ComponentFixture<InvestmentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestmentDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./investment-detail.component').then(m => m.InvestmentDetailComponent),
              resolve: { investment: () => of({ id: 3414 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(InvestmentDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load investment on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', InvestmentDetailComponent);

      // THEN
      expect(instance.investment()).toEqual(expect.objectContaining({ id: 3414 }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
