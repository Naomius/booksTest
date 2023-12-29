import {Injectable} from "@angular/core";
import {BehaviorSubject, map, Observable} from "rxjs";
import {ApiBooksService} from "../apiService/apiBooks.service";
import {IBooksManager} from "../../../base/books/books.component";
import {CartBookDetails, CartStoreService} from "../cartStore.service";


@Injectable()
export class BooksFacadeService implements IBooksManager {

    constructor(private apiBooksService: ApiBooksService,
                private cartStoreService: CartStoreService) {
    }

    addBooksToCart(bookWithCount: BookWithCount): void {
        this.cartStoreService.addToCart(bookWithCount);
    }

    removeBooksFromCart(bookId: number): void {
        this.cartStoreService.removeFromCart(bookId);
    }

    getBooks(): Observable<Book[]> {
        return this.apiBooksService.Books.pipe(
            map(json => json.books.map(book => ({
                ...book,
                    price: Number(book.price.replace(/[^0-9\.-]+/g, ""))
            })))
        );
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

export interface BookWithCount {
    book: Book,
    count: number
}
