import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { HoldingsComponent } from './features/holdings-page/holdings/holdings.component';
import { TransactionsComponent } from './features/transactions-page/transactions/transactions.component';
import { RecenttransactionsComponent } from './features/transactions-page/recenttransactions/recenttransactions.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { HomeComponent } from './features/auth/home/home.component';
 
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'header', component: HeaderComponent },
  { path: 'footer', component: FooterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard] // Protect this route
  },
  {
    path: 'holdings',
    component: HoldingsComponent,
    canActivate: [AuthGuard] // Protect this route
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [AuthGuard] // Protect this route
  },
  {
    path: 'recenttransactions',
    component: RecenttransactionsComponent,
    canActivate: [AuthGuard] // Protect this route
  }
];