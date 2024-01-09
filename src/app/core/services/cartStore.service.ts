
import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject, merge, scan, Observable, map, tap} from 'rxjs';
import {BookId} from "../../base/books/books.component";

@Injectable({
    providedIn: 'root'
})
export class CartStoreService {
    private readonly booksInCartSubject$ = new BehaviorSubject<CartBook[]>([]);
    private addBookToCart$ = new Subject<BookId>();
    private removeBookFromCart$ = new Subject<number>();

    constructor() {
        merge(
            this.addBookToCart$.pipe(
                map(bookCounter => (currentBooks: CartBook[]) => {
                    const bookIndex = currentBooks.findIndex(b => b.id === bookCounter.id);
                    if (bookIndex !== -1) {
                        currentBooks[bookIndex] = { ...currentBooks[bookIndex], count: currentBooks[bookIndex].count + 1 };
                        return [...currentBooks];
                    }
                    return [...currentBooks, { id: bookCounter.id, count: bookCounter.count }];
                })
            ),
            this.removeBookFromCart$.pipe(
                map((bookId: number) => (currentBooks: CartBook[]) => currentBooks.filter(book => book.id !== bookId)),
            )
        ).pipe(
            scan((books: CartBook[], operation) => operation(books), []),
        ).subscribe(this.booksInCartSubject$);
    }

    addToCart(cartBook: BookId): void {
        this.addBookToCart$.next(cartBook);
    }

    removeFromCart(bookId: number): void {
        this.removeBookFromCart$.next(bookId);
    }

    get booksInCart$(): Observable<CartBook[]> {
        return this.booksInCartSubject$;
    }
}

export interface CartBook {
    id: number;
    count: number;
}
