import {Component, Inject, OnInit} from '@angular/core';
import {
    BookWithCount,
    ShoppingCartFacadeService
} from "../../core/services/facadesManagement/shopping-cart.facade.service";
import {ShoppingCartFacadeToken} from "./tokens/shoppingCartFacadeToken";
import {map, Observable, Subject} from "rxjs";
import {BookTotalPrice, ShoppingCartHelper} from "./helpers/shoppingCartHelper";

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

    public books$: Observable<BookWithCount[]>;
    public totalBooksPrice$: Observable<number>;
    public totalBooksCount$: Observable<number>;

    public bookCounterChange$: Subject<CartBooksId> = new Subject<CartBooksId>();

    ngOnInit(): void {
        this.books$ = this.shoppingCartFacadeService.BookInCart

        const totals$: Observable<BookTotalPrice> = ShoppingCartHelper.calculateTotals(this.books$)
        this.totalBooksCount$ = totals$.pipe(map((totals: BookTotalPrice)=> totals.count));
        this.totalBooksPrice$ = totals$.pipe(map((totals: BookTotalPrice) => totals.price));

    }
}

export interface IShoppingCartManager {
    BookInCart: Observable<BookWithCount[]>;
}

export interface CartBooksId {
    id: number,
    count: number
}
