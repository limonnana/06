import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { MiscellaneousDetailComponent } from './miscellaneous-detail.component';

describe('Miscellaneous Management Detail Component', () => {
  let comp: MiscellaneousDetailComponent;
  let fixture: ComponentFixture<MiscellaneousDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiscellaneousDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./miscellaneous-detail.component').then(m => m.MiscellaneousDetailComponent),
              resolve: { miscellaneous: () => of({ id: 11098 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(MiscellaneousDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscellaneousDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load miscellaneous on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MiscellaneousDetailComponent);

      // THEN
      expect(instance.miscellaneous()).toEqual(expect.objectContaining({ id: 11098 }));
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
