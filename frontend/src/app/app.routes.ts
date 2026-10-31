
import { Routes } from '@angular/router';

import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { ProductList } from './features/products/product-list/product-list';
import { ProductForm } from './features/products/product-form/product-form';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

  // Public routes - without sidebar
  {
    path: 'register',
    component: Register
  },
  {
    path: 'login',
    component: Login
  },

  // Protected routes - with shared sidebar
  {
    path: '',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'products',
        component: ProductList
      },
      {
        path: 'products/add',
        component: ProductForm
      },
      {
        path: 'products/edit/:id',
        component: ProductForm
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Unknown routes
  {
    path: '**',
    redirectTo: 'login'
  }
];
