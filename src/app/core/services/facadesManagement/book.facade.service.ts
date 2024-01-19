import {Injectable} from "@angular/core";
import {IBookManager} from "../../../base/book/book.component";
import {SharedBooksService} from "../booksService/shared-books.service";
import {BehaviorSubject, map, Observable, Subject, switchMap} from "rxjs";
import {CartStoreService} from "../cartStore.service";

@Injectable()
export class BookFacadeService implements IBookManager{

    private readonly currentBook$: Observable<Book>;
    private readonly bookInCart$: Observable<BookId[]>

    private readonly getBookById$: Subject<number> = new BehaviorSubject<number>(null);
    constructor(private sharedBooksService: SharedBooksService,
                private cartService: CartStoreService) {
        this.currentBook$ = this.getBookById$.pipe(
            switchMap(id => {
                return this.sharedBooksService.getBooks().pipe(
                    map(books => books.find(book => book.id === id)),
                )
            }),
        )

        this.bookInCart$ = this.cartService.BooksInCart;
    }
    updateCart(bookId: BookId): void {
        this.cartService.updateCart(bookId);
    }
    getBookId(id: number): void {
        this.getBookById$.next(id);
    }

    get Book(): Observable<Book> {
        return this.currentBook$;
    }

    get BookInCart(): Observable<BookId[]> {
        return this.bookInCart$;
    }

}

interface Book {
    id: number;
    title: string;
    subtitle: string;
    isbn13: string;
    price: number;
    image: string;
    url: string;
}

interface BookId {
    id: number;
    count: number;
}
