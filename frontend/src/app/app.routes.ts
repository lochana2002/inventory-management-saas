
import { Routes } from '@angular/router';

import { Home } from './features/home/home';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { ProductList } from './features/products/product-list/product-list';
import { ProductForm } from './features/products/product-form/product-form';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { authGuard } from './guards/auth-guard';
import { StockHistoryComponent } from './features/stock/stock-history/stock-history';

export const routes: Routes = [

  // Public landing page
  {
    path: '',
    component: Home,
    pathMatch: 'full'
  },

  // Public authentication pages
  {
    path: 'register',
    component: Register
  },
  {
    path: 'login',
    component: Login
  },

  // Protected pages with shared sidebar
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
      { path: 'stock-history', component: StockHistoryComponent },
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
    redirectTo: ''
  }
];
