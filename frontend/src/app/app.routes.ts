import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateUserComponent } from './users/create-user/create-user.component';
import { DownlineComponent } from './users/downline/downline.component';
import { AdminSummaryComponent } from './admin/admin-summary/admin-summary.component';
import { AdminLevelUsersComponent } from './admin/admin-level-users/admin-level-users.component';
import { AdminCreditComponent } from './admin/admin-credit/admin-credit.component';
import { ChangeChildPasswordComponent } from './users/change-child-password/change-child-password.component';
import { AdminDownlineComponent } from './admin/admin-downline/admin-downline.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'users/create', component: CreateUserComponent, canActivate: [authGuard] },
  { path: 'users/downline', component: DownlineComponent, canActivate: [authGuard] },
  { path: 'users/change-password', component: ChangeChildPasswordComponent, canActivate: [authGuard] },

  { path: 'admin/summary', component: AdminSummaryComponent, canActivate: [authGuard, roleGuard('ADMIN')] },
  { path: 'admin/level-users', component: AdminLevelUsersComponent, canActivate: [authGuard, roleGuard('ADMIN')] },
{ path: 'admin/credit', component: AdminCreditComponent, canActivate: [authGuard, roleGuard('ADMIN')] },
{ path: 'admin/downline/:userId', component: AdminDownlineComponent, canActivate: [authGuard, roleGuard('ADMIN')] },

  { path: '**', redirectTo: '' }
];
