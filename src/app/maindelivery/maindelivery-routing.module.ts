import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaindeliveryPage } from './maindelivery.page';

const routes: Routes = [
  {
    path: '',
    component: MaindeliveryPage,
    // children: [{
    //   path: 'salad',
    //   loadChildren: () => import('./category/salad/salad.module').then( m => m.SaladPageModule)
    // },
    // {
    //   path: 'side',
    //   loadChildren: () => import('./category/side/side.module').then( m => m.SidePageModule)
    // },
    // {
    //   path: 'pizza',
    //   loadChildren: () => import('./category/pizza/pizza.module').then( m => m.PizzaPageModule)
    // },
    // {
    //   path: 'burger',
    //   loadChildren: () => import('./category/burger/burger.module').then( m => m.BurgerPageModule)
    // },
    // {
    //   path: 'dimatina',
    //   loadChildren: () => import('./category/dimatina/dimatina.module').then( m => m.DimatinaPageModule)
    // },
    // {
    //   path: 'dessert',
    //   loadChildren: () => import('./category/dessert/dessert.module').then( m => m.DessertPageModule)
    // }]
},
{
  path: 'search',
  loadChildren: () => import('./footer/search/search.module').then(m => m.SearchPageModule)
},
{
  path: 'takeaway',
  loadChildren: () => import('../maindelivery/tabs/takeaway/takeaway.module').then(m => m.TakeawayPageModule)
},
{
  path: 'reservation',
  loadChildren: () => import('../maindelivery/tabs/reservation/reservation.module').then( m => m.ReservationPageModule)
},
{
  path: 'delivery',
  loadChildren: () => import('../maindelivery/tabs/delivery/delivery.module').then( m => m.DeliveryPageModule)
},
{
  path: 'dinein',
  loadChildren: () => import('../maindelivery/tabs/dinein/dinein.module').then( m => m.DineinPageModule)
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaindeliveryPageRoutingModule {}