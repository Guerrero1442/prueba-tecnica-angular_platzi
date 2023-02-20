import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import MainComponent from './components/main/main.component';

import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'all',
        pathMatch: 'full',
      },
      {
        path: 'all',
        component: MainComponent,
        data: { filter: 'all' },
      },
      {
        path: 'pending',
        component: MainComponent,
        data: { filter: 'pending' },
      },
      {
        path: 'completed',
        component: MainComponent,
        data: {
          filter: 'completed',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
