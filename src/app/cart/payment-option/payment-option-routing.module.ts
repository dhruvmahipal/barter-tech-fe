import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentOptionPage } from './payment-option.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentOptionPage
  },
  // {
  //   path: 'card',
  //   loadChildren: () => import('./card/card.module').then( m => m.CardPageModule)
  // }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentOptionPageRoutingModule {}
