import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { UserListComponent } from './features/admin/users/users-list/users-list';
import { AdminHomeComponent } from './features/admin/admin-home/admin-home/admin-home';
import { AddUserComponent } from './features/admin/users/add-user/add-user';
import { ADMIN_ROUTES } from './features/admin/admin.route';
import { WAREHOUSE_ROUTES } from './features/warehouse/warehouse.routes';
import { CUSTOMER_ROUTES } from './features/customer/customer.routes';
import { FINANCE_ROUTES } from './features/finance/finance.routes';
import { SALES_ROUTES } from './features/Sales/sales.routes';

export const routes: Routes = [
    {path:'login',component:Login},
    {path:'register',component:Register},
    {
    path: 'admin',
    component: MainLayout,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] },
    children: [
      { path: '', component: AdminHomeComponent },
      { path: 'users', component: UserListComponent }
    ]
  },
 
  {
  path: 'admin',
  children: ADMIN_ROUTES
},
{ 
    path: 'warehouse',
    loadChildren: () =>
      import('./features/warehouse/warehouse.routes').then(m => m.WAREHOUSE_ROUTES)
  }, 
    {
    path: 'customer',
    children: CUSTOMER_ROUTES
  },
      {
    path: 'finance',
    children: FINANCE_ROUTES
  },
  {
    path: 'sales',
    children: SALES_ROUTES
  },

    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
