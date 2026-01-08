import { Routes } from '@angular/router';
import { AppLayout } from '../../core/layout/app-layout/app-layout';
import { InventoryListComponent } from './inventory-list/inventory-list';
import { OrderFulfillmentComponent } from './order-fulfillment/order-fulfillment';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { DashboardsReports } from './dashboards-reports/dashboards-reports';

export const WAREHOUSE_ROUTES: Routes = [
  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Warehouse', 'WarehouseManager'] },
    children: [
      { path: 'inventory', component: InventoryListComponent },
      { path: 'orders', component: OrderFulfillmentComponent },
      {path:'dashboard',component:DashboardsReports},
      { path: '', redirectTo: 'inventory', pathMatch: 'full' }
    ]
  }
];
