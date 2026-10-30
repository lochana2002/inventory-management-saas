import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register';
import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard/dashboard';

import { authGuard } from './guards/auth-guard';
export const routes: Routes = [
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];