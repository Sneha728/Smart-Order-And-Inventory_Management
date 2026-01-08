import { Routes } from '@angular/router';
import { AppLayout } from '../../core/layout/app-layout/app-layout';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

import { FinanceInvoicesComponent } from './finance-invoice/finance-invoice'
import { FinanceReports } from './finance-reports/finance-reports';

export const FINANCE_ROUTES: Routes = [
  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['FinanceOfficer'] },
    children: [
      { path: 'invoices', component: FinanceInvoicesComponent },
      { path: 'reports', component: FinanceReports },
      { path: '', redirectTo: 'invoices', pathMatch: 'full' }
    ]
  }
];
