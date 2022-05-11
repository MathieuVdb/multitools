import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', 
    redirectTo: 'weather', 
    pathMatch: 'full'
  },
  {
    path: 'weather',
    loadChildren: () => import('./pages/weather/weather.module').then( m => m.WeatherPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
