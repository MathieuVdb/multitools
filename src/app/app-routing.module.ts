import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AlreadyLoggedGuard } from './utils/guards/already-logged.guard';
import { UserGuard } from './utils/guards/user.guard';

const routes: Routes = [
  {
    path: '', 
    redirectTo: 'weather', 
    pathMatch: 'full'
  },
  {
    path: 'weather',
    canActivate: [UserGuard],
    loadChildren: () => import('./pages/weather/weather.module').then( m => m.WeatherPageModule)
  },
  {
    path: 'login',
    canActivate: [],
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
