import { Routes } from '@angular/router';

import { AppLayout } from '../../core/layout/app-layout/app-layout';

import { UserListComponent } from './users/users-list/users-list';
import { AddUserComponent } from './users/add-user/add-user';
import { EditUserRoleComponent } from './users/edit-user-role/edit-user-role';

import { CategoriesListComponent } from './categories/categories-list/categories-list';
import { AddEditCategoryComponent } from './categories/add-edit-category/add-edit-category';

import { ProductsListComponent } from './products/products-list/products-list';
import { AddEditProductComponent } from './products/add-edit-product/add-edit-product';

import { authGuard } from '../../core/guards/auth.guard';
import { roleGuard } from '../../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin'] },
    children: [

      // ---------- USERS ----------
      { path: 'users', component: UserListComponent },
      { path: 'users/add', component: AddUserComponent },
      { path: 'users/:id/edit-role', component: EditUserRoleComponent },

      // ---------- CATEGORIES ----------
      { path: 'categories', component: CategoriesListComponent },
      { path: 'categories/add', component: AddEditCategoryComponent },
      { path: 'categories/edit/:id', component: AddEditCategoryComponent },

      // ---------- PRODUCTS ----------
      { path: 'products', component: ProductsListComponent },
      { path: 'products/add', component: AddEditProductComponent },
      { path: 'products/edit/:id', component: AddEditProductComponent },

      // Default
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  }
];
