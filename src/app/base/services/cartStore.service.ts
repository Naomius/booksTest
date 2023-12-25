import {Injectable} from '@angular/core';
import {BehaviorSubject, map, merge, Observable, scan, Subject, switchMap, tap} from "rxjs";
import {ApiBooksService} from "../../core/services/apiService/apiBooks.service";

@Injectable({
    providedIn: 'root'
})
export class CartStoreService {
    private booksInCartSubject$ = new BehaviorSubject<BookDetails[]>([]);
    private bookAddSubject$ = new Subject<BooksCounter>();
    private bookRemoveSubject$ = new Subject<number>();

    constructor(private apiBookService: ApiBooksService) {
        merge(
            this.bookAddSubject$.pipe(
                switchMap(({ id, count }) => this.apiBookService.getBookById(id).pipe(
                    map(book => ({
                        ...book,
                        count: count
                    })),
                )
            ),
                map(bookWithCount => (cart: BookDetails[]) => this._addBook(cart, bookWithCount))
        ),
            this.bookRemoveSubject$.pipe(
                map(bookId => (cart: BookDetails[]) => this._removeBook(cart, bookId))
            )
        ).pipe(
            scan((books: BookDetails[], operator: (books: BookDetails[]) => BookDetails[]) =>
            operator(books), []),
            tap(updatedBooks => this.booksInCartSubject$.next(updatedBooks)),
        )
    }

    addToCart(id: number, count: number): void {
        this.bookAddSubject$.next({ id, count });
    }

    removeFromCart(bookId: number): void {
        this.bookRemoveSubject$.next(bookId);
    }

    private _addBook(books: BookDetails[], bookToAdd: BookDetails): BookDetails[] {
        const bookIndex = books.findIndex(book => book.id === bookToAdd.id);
        if (bookIndex !== -1) {
            const updatedBooks = [...books];
            updatedBooks[bookIndex].count += bookToAdd.count;
            return updatedBooks;
        } else {
            return [...books, bookToAdd];
        }
    }

    private _removeBook(books: BookDetails[], bookIdToRemove: number): BookDetails[] {
        return books.filter(book => book.id !== bookIdToRemove);
    }

    get booksInCart$(): Observable<BookDetails[]> {
        return this.booksInCartSubject$.asObservable();
    }
}


export interface BookDetails{
    id: number,
    title: string,
    subtitle: string,
    isbn13: string,
    price: string,
    image: string,
    url: string,
    count?: number,
}

export interface BooksCounter {
    id: number,
    count: number,
}

