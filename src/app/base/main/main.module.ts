import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MainRoutingModule} from './main-routing.module';
import {MainComponent} from "./main.component";
import {SharedModule} from "../../shared/shared.module";
import {FormsModule} from "@angular/forms";
import {BookComponent} from "./book/book.component";

@NgModule({
    declarations: [
        MainComponent,
        BookComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        SharedModule,
        MainRoutingModule
    ]
})
export class MainModule {
}
