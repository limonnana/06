import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import InvestmentResolve from './route/investment-routing-resolve.service';

const investmentRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/investment.component').then(m => m.InvestmentComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/investment-detail.component').then(m => m.InvestmentDetailComponent),
    resolve: {
      investment: InvestmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/investment-update.component').then(m => m.InvestmentUpdateComponent),
    resolve: {
      investment: InvestmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/investment-update.component').then(m => m.InvestmentUpdateComponent),
    resolve: {
      investment: InvestmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default investmentRoute;
