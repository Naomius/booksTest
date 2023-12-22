import {InjectionToken} from "@angular/core";
import {IShoppingCartManager} from "../shopping-cart.component";

export const ShoppingCartFacadeToken = new InjectionToken<IShoppingCartManager>('ShoppingCartFacadeToken')
