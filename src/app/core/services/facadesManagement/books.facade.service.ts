import {Injectable} from "@angular/core";
import { map, Observable} from "rxjs";
import {ApiBooksService} from "../apiService/apiBooks.service";
import {IBooksManager} from "../../../base/books/books.component";
import {CartStoreService} from "../../../base/services/cartStore.service";
import {BookDetails} from "../../../base/books/interfaces/IBook";


@Injectable()
export class BooksFacadeService implements IBooksManager {


    constructor(private apiBooksService: ApiBooksService,
                private cartStoreService: CartStoreService) {
    }

    addBooksToCart(bookId: number, count: number): void {
       this.cartStoreService.addToCart(bookId, count);
    }

    removeBooksFromCart(bookId: number): void {
        this.cartStoreService.removeFromCart(bookId)
    }

    getBooks(): Observable<Book[]> {
        return this.apiBooksService.Books.pipe(
            map(json => json.books),
        );
    }

}

export interface Book {
    id: number,
    title: string,
    subtitle: string,
    isbn13: string,
    price: string,
    image: string,
    url: string,
}

export interface CartBookDetails extends BookDetails {
    count: number;
}

