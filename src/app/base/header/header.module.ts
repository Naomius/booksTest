import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from "./header.component";
import {SharedModule} from "../../shared/shared.module";
import {RouterLink, RouterModule} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";


@NgModule({
    declarations: [
        HeaderComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        BrowserModule,
        RouterLink,
        RouterModule
    ],
    exports:[
        HeaderComponent,
    ]
})
export class HeaderModule {

}
