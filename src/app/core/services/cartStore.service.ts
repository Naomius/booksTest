
import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject, merge, scan, Observable, map, tap} from 'rxjs';
import {BookId} from "../../base/books/books.component";

@Injectable({
    providedIn: 'root'
})
export class CartStoreService {
    private readonly booksInCartSubject$ = new BehaviorSubject<CartBook[]>([]);
    private bookAddSubject$ = new Subject<BookId>();
    private bookRemoveSubject$ = new Subject<number>();

    constructor() {
        merge(
            this.bookAddSubject$.pipe(
                map(bookCounter => (currentBooks: CartBook[]) => {
                    const bookIndex = currentBooks.findIndex(b => b.id === bookCounter.id);
                    if (bookIndex !== -1) {
                        currentBooks[bookIndex] = { ...currentBooks[bookIndex], count: currentBooks[bookIndex].count + 1 };
                        return [...currentBooks];
                    }
                    return [...currentBooks, { id: bookCounter.id, count: bookCounter.count }];
                })
            ),
            this.bookRemoveSubject$.pipe(
                map((bookId: number) => (currentBooks: CartBook[]) => currentBooks.filter(book => book.id !== bookId)),
            )
        ).pipe(
            scan((books: CartBook[], operation) => operation(books), []),
        ).subscribe(this.booksInCartSubject$);
    }

    addToCart(cartBook: BookId): void {
        this.bookAddSubject$.next(cartBook);
    }

    removeFromCart(bookId: number): void {
        this.bookRemoveSubject$.next(bookId);
    }

    get booksInCart$(): Observable<CartBook[]> {
        return this.booksInCartSubject$;
    }
}

export interface CartBook {
    id: number;
    count: number;
}