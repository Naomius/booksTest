import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {
    BookWithCount,
    ShoppingCartFacadeService
} from "../../core/services/facadesManagement/shopping-cart.facade.service";
import {ShoppingCartFacadeToken} from "./tokens/shoppingCartFacadeToken";
import {count, filter, map, Observable, Subject, takeUntil, tap} from "rxjs";
import {BookPriceAndCount, ShoppingCartHelper} from "./helpers/shoppingCartHelper";
import {BooksId} from "../../core/services/facadesManagement/books.facade.service";



@Component({
    selector: 'app-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.scss'],
    providers: [
        ShoppingCartFacadeService,
        {provide: ShoppingCartFacadeToken, useExisting: ShoppingCartFacadeService}
    ]
})
export class ShoppingCartComponent implements OnInit, OnDestroy{

    constructor(@Inject(ShoppingCartFacadeToken) private shoppingCartFacadeService: IShoppingCartManager) {
    }

    public books$: Observable<BookWithCount[]>;
    public totalBooksPrice$: Observable<number>;
    public totalBooksCount$: Observable<number>;

    public bookCounterChange$: Subject<CartBooksId> = new Subject<CartBooksId>();
    destroy$: Subject<boolean> = new Subject<boolean>();

    ngOnInit(): void {
        this.books$ = this.shoppingCartFacadeService.BooksInCart;

        const totals$: Observable<BookPriceAndCount> = ShoppingCartHelper.calculateTotals(this.books$);
        this.totalBooksCount$ = totals$.pipe(map((totals: BookPriceAndCount)=> totals.count));
        this.totalBooksPrice$ = totals$.pipe(map((totals: BookPriceAndCount) => totals.price));

        this. initializeSideEffect();

    }

    initializeSideEffect(): void {
        this.bookCounterChange$.pipe(
            filter(booksToCart  => booksToCart.count > 0),
            takeUntil(this.destroy$),
        ).subscribe((bookToCart: CartBooksId): void => {
            const count: number = bookToCart.count > 0 ? bookToCart.count : 0;
            const message = count > 0 ? `Заказали книгу по id ${bookToCart.id} в кол-ве ${count} шт` :
                `Убрали из заказа книгу по id ${bookToCart.id}`;
            console.log(message);
            this.shoppingCartFacadeService.updateCart({id: bookToCart.id, count})
        })
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
    }

}

export interface IShoppingCartManager {
    BooksInCart: Observable<BookWithCount[]>,
    updateCart(booksId: BooksId): void,
}

export interface CartBooksId {
    id: number,
    count: number
}
