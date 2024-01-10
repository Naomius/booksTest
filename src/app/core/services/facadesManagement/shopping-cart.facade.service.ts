import { Injectable } from '@angular/core';
import {IShoppingCartManager} from "../../../base/shoppingCart/shopping-cart.component";
import {BehaviorSubject, map, Observable, switchMap} from "rxjs";
import {CartBook, CartStoreService} from "../cartStore.service";
import {SharedBooksService} from "../booksService/shared-books.service";


@Injectable()
export class ShoppingCartFacadeService implements IShoppingCartManager {

    private readonly currentBooks$: Observable<BookWithCount[]>;
    private readonly getBookById$: BehaviorSubject<CartBook[]> = new BehaviorSubject<CartBook[]>([])
  constructor(private cartStoreService: CartStoreService,
              private sharedBooksService: SharedBooksService) {

        this.cartStoreService.BooksInCart.subscribe((booksInCart: CartBook[]): void => {
            this.getBookById$.next(booksInCart)
        })

      this.currentBooks$ = this.getBookById$.pipe(
         switchMap((books: CartBook[]) => {
             return this.sharedBooksService.getBooks().pipe(
                 map((allBooks: Book[]) => {
                     return books.map((bookInCart: CartBook) => {
                         const currentBook: Book = allBooks.find((book: Book): boolean => book.id === bookInCart.id);
                         return {
                             id: currentBook.id,
                             title: currentBook.title,
                             subtitle: currentBook.subtitle,
                             isbn13: currentBook.isbn13,
                             price: currentBook.price,
                             image: currentBook.image,
                             url: currentBook.url,
                             count: bookInCart.count
                         }
                     })
                 })
             )
         }),
      )

  }


    get BookInCart(): Observable<BookWithCount[]> {
      return this.currentBooks$;
    }

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

export interface BookWithCount extends Book {
    count: number
}


