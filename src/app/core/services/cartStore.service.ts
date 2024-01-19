
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of, withLatestFrom} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CartStoreService {
    private readonly currentBooks$: Observable<CartBook[]>;
    private readonly booksInCart$: BehaviorSubject<CartBook[]> = new BehaviorSubject<CartBook[]>([]);

    constructor() {
        this.currentBooks$ = this.booksInCart$;
    }
    updateCart(cartBook: CartBook): void {
        of(null).pipe(
            withLatestFrom(this.booksInCart$),
            map(([_, books]): CartBook[] => {
                const index: number = books.findIndex((item : CartBook): boolean => item.id === cartBook.id);

                if (cartBook.count === 0) {
                    return books.filter((book: CartBook): boolean => book.id !== cartBook.id)
                }
                return index === -1
                    ? [...books, cartBook]
                    : books.map((book: CartBook, i: number): CartBook => i === index ? cartBook : book);
            })
        ).subscribe((updatedBooks: CartBook[]) => this.booksInCart$.next(updatedBooks));
    }

    get BooksInCart(): Observable<CartBook[]> {
        return this.currentBooks$;
    }
}

export interface CartBook {
    id: number;
    count: number;
}

