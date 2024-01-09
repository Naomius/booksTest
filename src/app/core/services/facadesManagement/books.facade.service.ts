import {Injectable} from "@angular/core";
import {BehaviorSubject, map, Observable} from "rxjs";
import {ApiBooksService} from "../apiService/apiBooks.service";
import {IBooksManager} from "../../../base/books/books.component";
import {CartBook, CartStoreService} from "../cartStore.service";


@Injectable()
export class BooksFacadeService implements IBooksManager {

    constructor(private apiBooksService: ApiBooksService,
                private cartStoreService: CartStoreService) {
    }

    addBooksToCart(booksCounter: BooksCounter): void {
        this.cartStoreService.addToCart(booksCounter)
    }

    removeBooksFromCart(bookId: number): void {
        this.cartStoreService.removeFromCart(bookId);
    }

    getBooks(): Observable<Book[]> {   //TODO добавить геттер для получения книг
        return this.apiBooksService.Books.pipe(
            map(json => json.books.map(book => ({
                ...book,
                    price: Number(book.price.replace(/[^0-9\.-]+/g, ""))
            })))
        );
    }

    get Books(): Observable<Book[]> {
        return this.getBooks();
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
