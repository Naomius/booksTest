import {Component, Inject} from '@angular/core';
import {ShoppingCartFacadeService} from "../../core/services/facadesManagement/shopping-cart.facade.service";
import {ShoppingCartFacadeToken} from "./tokens/shoppingCartFacadeToken";

@Component({
    selector: 'app-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.scss'],
    providers: [
        ShoppingCartFacadeService,
        {provide: ShoppingCartFacadeToken, useExisting: ShoppingCartFacadeService}
    ]
})
export class ShoppingCartComponent {

    constructor(@Inject(ShoppingCartFacadeToken) private shoppingCartFacadeService: IShoppingCartManager) {
    }

}

export interface IShoppingCartManager {

}
