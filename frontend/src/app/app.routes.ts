import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Torneos } from './pages/torneos/torneos';
import { Equipos } from './pages/equipos/equipos';
import { Partidas } from './pages/partidas/partidas';
import { Perfil } from './pages/perfil/perfil';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },
  {
    path: 'torneos',
    component: Torneos,
    canActivate: [authGuard],
  },
  {
    path: 'equipos',
    component: Equipos,
    canActivate: [authGuard],
  },
  {
    path: 'partidas',
    component: Partidas,
    canActivate: [authGuard],
  },
  {
    path: 'perfil',
    component: Perfil,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
