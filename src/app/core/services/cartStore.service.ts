
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, share, shareReplay, take} from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CartStoreService {
    private readonly currentBooks$: Observable<CartBook[]>;
    private readonly booksInCart$ = new BehaviorSubject<CartBook[]>([]);

    constructor() {
        this.currentBooks$ = this.booksInCart$;
    }
    updateCart(cartBook: CartBook): void {
        this.booksInCart$.pipe(
            take(1),
            map(books => {
                const cloneBooks = [...books];
                const index = cloneBooks.findIndex(item => item.id === cartBook.id);

                if (cartBook.count > 0) {
                    if (index === -1) {
                        cloneBooks.push(cartBook);
                    } else {
                        cloneBooks[index] = cartBook;
                    }
                } else if (cartBook.count === 0 && index !== -1) {
                    cloneBooks.splice(index, 1);
                }

                return cloneBooks;
            }),
            tap(updatedBooks => this.booksInCart$.next(updatedBooks))
        ).subscribe();
    }

    get BooksInCart(): Observable<CartBook[]> {
        return this.currentBooks$;
    }
}

export interface CartBook {
    id: number;
    count: number;
}

