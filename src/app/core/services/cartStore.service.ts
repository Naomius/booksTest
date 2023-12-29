import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject, merge, scan, Observable, map, tap} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CartStoreService {
    private readonly booksInCartSubject$ = new BehaviorSubject<CartBookDetails[]>([]);
    private bookAddSubject$ = new Subject<CartBookWithCounter>();
    private bookRemoveSubject$ = new Subject<number>();

    constructor() {
        merge(
            this.bookAddSubject$.pipe(
                map(({ book, count }) => (currentBooks: CartBookDetails[]) => {
                    const bookIndex = currentBooks.findIndex(b => b.id === book.id);
                    if (bookIndex !== -1) {
                        let updatedBook = { ...currentBooks[bookIndex], count: (currentBooks[bookIndex].count ?? 0) + count };
                        let newBooks = [...currentBooks];
                        newBooks[bookIndex] = updatedBook;
                        return newBooks;
                    }
                    return [...currentBooks, { ...book, count }];
                })
            ),
            this.bookRemoveSubject$.pipe(
                map(bookId => (currentBooks: CartBookDetails[]) => currentBooks.filter(book => book.id !== bookId)),
            )
        ).pipe(
            scan((books: CartBookDetails[], operation) => operation(books), []),
            tap(console.log),
        ).subscribe(this.booksInCartSubject$);
    }

    addToCart(bookCounter: CartBookWithCounter): void {
        this.bookAddSubject$.next(bookCounter);
    }

    removeFromCart(bookId: number): void {
        this.bookRemoveSubject$.next(bookId);
    }

    get booksInCart$(): Observable<CartBookDetails[]> {
        return this.booksInCartSubject$.asObservable();
    }
}

export interface CartBookDetails {
    id: number;
    title: string;
    subtitle: string;
    isbn13: string;
    price: number;
    image: string;
    url: string;
    count?: number;
}

export interface CartBookWithCounter {
    book: CartBookDetails;
    count: number;
}
