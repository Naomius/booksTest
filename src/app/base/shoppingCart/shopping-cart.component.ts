import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {
    BooksAndCount,
    ShoppingCartFacadeService
} from "../../core/services/facadesManagement/shopping-cart.facade.service";
import {ShoppingCartFacadeToken} from "./tokens/shoppingCartFacadeToken";
import {filter, map, Observable, Subject, takeUntil} from "rxjs";

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

    constructor(@Inject(ShoppingCartFacadeToken) private shoppingCartFacadeService: IShoppingCartManager) {}

    public books$: Observable<BooksAndCount[]>;
    public calculateTotals$: Observable<BookPriceAndCount[]>;

    public bookCounterChange$: Subject<BooksId> = new Subject<BooksId>();
    private destroy$: Subject<boolean> = new Subject<boolean>();

    ngOnInit(): void {
        this.books$ = this.shoppingCartFacadeService.BooksInCart;

        this.calculateTotals$ = this.books$.pipe(
            map((books: BooksAndCount[]) => { //todo вынести отдельно
                const totalCount: number = books.reduce((acc, book) => acc + book.count, 0);
                const totalPrice: number = books.reduce((acc, book) => acc + (book.count * book.books.price), 0);
                return [{count: totalCount, price: totalPrice}];
            })
        );

        this. initializeSideEffect();
    }

   private initializeSideEffect(): void {
        this.bookCounterChange$.pipe(
            filter(booksToCart  => booksToCart.count >= 0),
            takeUntil(this.destroy$),
        ).subscribe(bookToCart  => {
            const count = bookToCart.count > 0 ? bookToCart.count : 0; //todo лишнее
            this.shoppingCartFacadeService.updateCart({id: bookToCart.id, count})
        })
    }
    ngOnDestroy(): void {
        this.destroy$.next(true);
    }

}

export interface IShoppingCartManager {
    BooksInCart: Observable<BooksAndCount[]>,
    updateCart(booksId: BooksId): void,
}

export interface BooksId {
    id: number,
    count: number
}

interface BookPriceAndCount {
    count: number,
    price: number,
}

