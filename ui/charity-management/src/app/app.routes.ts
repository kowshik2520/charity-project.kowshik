import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { SplashComponent } from './components/splash/splash.component';
import { CampaignManagementComponent } from './components/campaign-management/campaign-management.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    { path: '', component: SplashComponent },
    { path: 'home', component: HomeComponent},
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'campaigns', component: CampaignManagementComponent },
];
