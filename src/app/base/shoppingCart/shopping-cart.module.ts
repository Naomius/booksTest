import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartRoutingModule } from './shopping-cart-routing.module';
import {ShoppingCartComponent} from "./shopping-cart.component";
import {EmptyCartComponent} from "./emptyCart/empty-cart.component";
import {SharedModule} from "../../shared/shared.module";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
    declarations: [
        ShoppingCartComponent,
        EmptyCartComponent
    ],
    imports: [
        CommonModule,
        ShoppingCartRoutingModule,
        SharedModule
    ]
})
export class ShoppingCartModule { }
