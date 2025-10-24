import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import MiscellaneousResolve from './route/miscellaneous-routing-resolve.service';

const miscellaneousRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/miscellaneous.component').then(m => m.MiscellaneousComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/miscellaneous-detail.component').then(m => m.MiscellaneousDetailComponent),
    resolve: {
      miscellaneous: MiscellaneousResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/miscellaneous-update.component').then(m => m.MiscellaneousUpdateComponent),
    resolve: {
      miscellaneous: MiscellaneousResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/miscellaneous-update.component').then(m => m.MiscellaneousUpdateComponent),
    resolve: {
      miscellaneous: MiscellaneousResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default miscellaneousRoute;
