import { Routes } from '@angular/router';
import { AppLayout } from '../../core/layout/app-layout/app-layout';
import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

/* SALES COMPONENTS */
import { CreateOrderComponent} from './create-order/create-order';
import { CustomerOrders } from '../Sales/customer-orders/customer-orders';
import { SalesInvoiceBillingComponent } from '../Sales/invoice-billing/invoice-billing';


export const SALES_ROUTES: Routes = [
  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['SalesExecutive'] },
    children: [

      /* DEFAULT */
      {
        path: '',
        redirectTo: 'create-order',
        pathMatch: 'full'
      },

      /* CREATE ORDER */
      {
        path: 'create-order',
        component: CreateOrderComponent
      },



      /* ORDER TRACKING */
      {
        path: 'orders',
        component: CustomerOrders
      },

      /* INVOICES & BILLING */
     {
       path: 'billing',
       component: SalesInvoiceBillingComponent
     }
    ]
  }
];
