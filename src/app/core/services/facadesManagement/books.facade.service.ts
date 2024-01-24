import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {BookId, IBooksManager} from "../../../base/books/books.component";
import {CartStoreService} from "../cartStore.service";
import {SharedBooksService} from "../sharedBooksService/shared-books.service";


@Injectable()
export class BooksFacadeService implements IBooksManager {

    private readonly books$: Observable<Book[]>;
    private readonly booksInCart$: Observable<BooksId[]>;

    constructor(private sharedBooksService: SharedBooksService,
                private cartStoreService: CartStoreService) {
        this.books$ = this.sharedBooksService.getBooks();
        this.booksInCart$ = this.cartStoreService.BooksInCart;
    }

    updateCart(booksCounter: BooksId): void {
        this.cartStoreService.updateCart(booksCounter)
    }

    get BookInCart(): Observable<BookId[]> {
        return this.booksInCart$
    }

    get Books(): Observable<Book[]> {
        return this.books$;
    }

}

export interface Book {
    id: number;
    title: string;
    subtitle: string;
    isbn13: string;
    price: number;
    image: string;
    url: string;
}

export interface BooksId {
    id: number;
    count: number;
}
