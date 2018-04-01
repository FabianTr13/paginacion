import { RouterModule, Routes } from '@angular/router';
import { ConfigProgramsComponent } from './components/config-programs/config-programs.component';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';

const APP_ROUTES: Routes = [
  { path: 'config', component: ConfigProgramsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, { useHash:true });
