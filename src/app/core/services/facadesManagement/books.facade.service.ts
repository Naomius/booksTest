import {Injectable} from "@angular/core";
import {map, Observable} from "rxjs";
import {ApiBooksService} from "../apiService/apiBooks.service";
import {IBooksManager} from "../../../base/books/books.component";
import {CartStoreService} from "../cartStore.service";
import {SharedBooksService} from "../booksService/shared-books.service";


@Injectable()
export class BooksFacadeService implements IBooksManager {

    books$: Observable<Book[]>;

    constructor(private sharedBooksService: SharedBooksService,
                private cartStoreService: CartStoreService) {
        this.books$ = this.sharedBooksService.getBooks()
    }

    addBooksToCart(booksCounter: BooksCounter): void {
        this.cartStoreService.addToCart(booksCounter)
    }

    removeBooksFromCart(bookId: number): void {
        this.cartStoreService.removeFromCart(bookId);
    }

    get Books(): Observable<Book[]> {
        return this.books$;
    }

    //Получение текущено значения книг из корзины
    // get bookInCart$(): Observable<CartBookDetails[]> {
    //     return this.cartStoreService.booksInCart$;
    // }

}

export interface Book {
    id: number,
    title: string,
    subtitle: string,
    isbn13: string,
    price: number,
    image: string,
    url: string,
}

export interface BooksCounter {
    id: number,
    count: number,
}
