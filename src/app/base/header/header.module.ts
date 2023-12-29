import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from "./header.component";
import {SharedModule} from "../../shared/shared.module";
import {RouterLink, RouterLinkActive, RouterModule} from "@angular/router";


@NgModule({
    declarations: [
        HeaderComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
        RouterLinkActive,
        RouterLink,
    ],
    exports:[
        HeaderComponent,
    ]
})
export class HeaderModule {

}
