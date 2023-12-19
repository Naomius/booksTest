import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartRoutingModule } from './shopping-cart-routing.module';
import {ShoppingCartComponent} from "./shopping-cart.component";
import {EmptyCartComponent} from "./emptyCart/empty-cart.component";

@NgModule({
  declarations: [
    ShoppingCartComponent,
    EmptyCartComponent
  ],
  imports: [
    CommonModule,
    ShoppingCartRoutingModule
  ]
})
export class ShoppingCartModule { }
