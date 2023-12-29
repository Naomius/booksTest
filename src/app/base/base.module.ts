import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseRoutingModule } from './base-routing.module';
import {HeaderModule} from "./header/header.module";
import {SharedModule} from "../shared/shared.module";


@NgModule({
    declarations: [
  ],
    imports: [
        CommonModule,
        HeaderModule,
        SharedModule,
        BaseRoutingModule,
    ],
    exports:[
        HeaderModule
    ]
})
export class BaseModule { }
