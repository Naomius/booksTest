import {Injectable} from "@angular/core";
import {map, Observable} from "rxjs";
import {Book, BooksCounter} from "../../../base/books/interfaces/IBook";
import {ApiBooksService} from "../apiService/apiBooks.service";
import {IBooksManager} from "../../../base/books/books.component";
import {CartStoreService} from "../../../base/services/cartStore.service";


@Injectable()
export class BooksFacadeService implements IBooksManager {

    private readonly currentBooks$!: Observable<Book[]>;

    constructor(private booksService: ApiBooksService,
                private cartStoreService: CartStoreService) {
        this.currentBooks$ = this.booksService.Books.pipe(
            map(b => b.books),
        );
    }

    addBooksToCart(newBook: Book): void {
        this.cartStoreService.addToCart(newBook);
    }

    removeBooksFromCart(bookId: number): void {
        this.cartStoreService.removeFromCart(bookId)
    }

    get Books(): Observable<Book[]> {
        return this.currentBooks$;
    }

}
