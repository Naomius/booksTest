import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
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

    updateCart(booksCounter: BooksId): void {
        this.cartStoreService.updateCart(booksCounter)
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

export interface BooksId {
    id: number,
    count: number,
}
