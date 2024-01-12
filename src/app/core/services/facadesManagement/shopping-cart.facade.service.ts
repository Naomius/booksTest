import { Injectable } from '@angular/core';
import {IShoppingCartManager} from "../../../base/shoppingCart/shopping-cart.component";
import {
    combineLatest,
    delay,
    map,
    Observable, startWith, tap,
    withLatestFrom
} from "rxjs";
import {CartBook, CartStoreService} from "../cartStore.service";
import {SharedBooksService} from "../booksService/shared-books.service";
import {BooksId} from "./books.facade.service";


@Injectable()
export class ShoppingCartFacadeService implements IShoppingCartManager {

    private readonly booksInCart$: Observable<BookWithCount[]>;
  constructor(private cartStoreService: CartStoreService,
              private sharedBooksService: SharedBooksService) {

      this.booksInCart$ = this.cartStoreService.BooksInCart.pipe(
          // delay(100),
          tap(b => console.log(b)),
          withLatestFrom(this.sharedBooksService.getBooks().pipe(
              tap(b => console.log(b)),
              startWith([])
          )),
          map(([cartBooks, books]) => {
              return cartBooks.map((bookInCart: CartBook) => {
                  const currentBook: Book = books.find(book => book.id === bookInCart.id);
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
      // this.booksInCart$ = combineLatest([
      //     this.cartStoreService.BooksInCart,
      //     this.sharedBooksService.getBooks()
      // ]).pipe(
      //     map(([cartBooks, books]) => {
      //         return cartBooks.map((bookInCart: CartBook) => {
      //             const currentBook: Book = books.find(book => book.id === bookInCart.id);
      //             return {
      //                 id: currentBook.id,
      //                 title: currentBook.title,
      //                 subtitle: currentBook.subtitle,
      //                 isbn13: currentBook.isbn13,
      //                 price: currentBook.price,
      //                 image: currentBook.image,
      //                 url: currentBook.url,
      //                 count: bookInCart.count
      //             }
      //         })
      //     })
      // )
  }

    updateCart(booksId: BooksId): void {
      this.cartStoreService.updateCart(booksId);
    }

    get BooksInCart(): Observable<BookWithCount[]> {
      return this.booksInCart$;
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


