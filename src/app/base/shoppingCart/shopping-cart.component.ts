import {Component, Inject, OnInit} from '@angular/core';
import {
    BookWithCount,
    ShoppingCartFacadeService
} from "../../core/services/facadesManagement/shopping-cart.facade.service";
import {ShoppingCartFacadeToken} from "./tokens/shoppingCartFacadeToken";
import {map, Observable, Subject} from "rxjs";
import {CartBook} from "../../core/services/cartStore.service";
import {ShoppingCartHelper} from "./helpers/shoppingCartHelper";

@Component({
    selector: 'app-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.scss'],
    providers: [
        ShoppingCartFacadeService,
        {provide: ShoppingCartFacadeToken, useExisting: ShoppingCartFacadeService}
    ]
})
export class ShoppingCartComponent implements OnInit{

    constructor(@Inject(ShoppingCartFacadeToken) private shoppingCartFacadeService: IShoppingCartManager) {
    }

    public books$: Observable<CartBook[]>;
    public totalBooksPrice$: Observable<number>;
    public totalBooksCount$: Observable<number>;

    public bookCounterChange$: Subject<CartBooksCounter> = new Subject<CartBooksCounter>();

    ngOnInit(): void {
        this.books$ = this.shoppingCartFacadeService.bookInCart$

        // const totals$ = ShoppingCartHelper._calculateTotals(this.books$)
        // this.totalBooksCount$ = totals$.pipe(map(totals => totals.count));
        // this.totalBooksPrice$ = totals$.pipe(map(totals => totals.price));

    }

}

export interface IShoppingCartManager {
    bookInCart$: Observable<CartBook[]>;
    addBooksToCart(bookWithCount: BookWithCount): void,
    removeBooksFromCart(bookId: number): void;
}

export interface CartBooks {
    id: number,
    title: string,
    subtitle: string,
    isbn13: string,
    price: number,
    image: string,
    url: string,
}

export interface CartBooksCounter {
    id: number,
    count: number
}
