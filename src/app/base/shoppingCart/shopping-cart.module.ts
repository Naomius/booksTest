import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartRoutingModule } from './shopping-cart-routing.module';
import {ShoppingCartComponent} from "./shopping-cart.component";
import {EmptyCartComponent} from "./emptyCart/empty-cart.component";
import {SharedModule} from "../../shared/shared.module";
import {BrowserModule} from "@angular/platform-browser";
import {MatButtonModule} from "@angular/material/button";

@NgModule({
    declarations: [
        ShoppingCartComponent,
        EmptyCartComponent
    ],
    imports: [
        CommonModule,
        ShoppingCartRoutingModule,
        MatButtonModule,
        SharedModule
    ]
})
export class ShoppingCartModule { }
