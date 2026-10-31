
import { Routes } from '@angular/router';

import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { ProductList } from './features/products/product-list/product-list';
import { ProductForm } from './features/products/product-form/product-form';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'register', component: Register },

  { path: 'login', component: Login },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },

  {
    path: 'products',
    component: ProductList,
    canActivate: [authGuard]
  },
  {
  path: 'products/add',
  component: ProductForm,
  canActivate: [authGuard]
},
{
  path: 'products/edit/:id',
  component: ProductForm,
  canActivate: [authGuard]
},

  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: '**', redirectTo: 'login' }
];
