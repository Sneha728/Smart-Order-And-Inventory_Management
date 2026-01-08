import { Routes } from '@angular/router';
import { AppLayout } from '../../core/layout/app-layout/app-layout';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';
import { PlaceOrderComponent } from './place-order/place-order';
import { OrderTrackingComponent } from './order-tracking/order-tracking';
import { InvoiceBillingComponent } from './invoice-billing/invoice-billing';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Customer'] },
    children: [
      {
        path: 'place-order',
        component:PlaceOrderComponent
      },
      {
        path: 'orders',
        component:OrderTrackingComponent
      },
      {
        path:'invoices',
        component:InvoiceBillingComponent
      },
      {
        path: '',
        redirectTo: 'place-order',
        pathMatch: 'full'
      }
    ]
  }
];
