
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
            map(books => {
                const updatedBooks = books.slice();
                const index = updatedBooks.findIndex(item => item.id === cartBook.id);

                if (index === -1) {
                    updatedBooks.push(cartBook);
                } else {
                    updatedBooks[index] = cartBook;
                }

                return updatedBooks;
            }),
            tap(updatedBooks => this.booksInCart$.next(updatedBooks))
        ).subscribe();
    }

    get booksInCart(): Observable<CartBook[]> {
        return this.currentBooks$;
    }
}

export interface CartBook {
    id: number;

    count: number;
}

