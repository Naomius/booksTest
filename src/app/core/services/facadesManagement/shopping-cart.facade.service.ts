import { Injectable } from '@angular/core';
import {IShoppingCartManager} from "../../../base/shoppingCart/shopping-cart.component";
import {
    map,
    Observable,
    withLatestFrom
} from "rxjs";
import {CartBook, CartStoreService} from "../cartStore.service";
import {SharedBooksService} from "../booksService/shared-books.service";
import {BooksId} from "./books.facade.service";


@Injectable()
export class ShoppingCartFacadeService implements IShoppingCartManager {

    private readonly booksInCart$: Observable<BooksAndCount[]>;
  constructor(private cartStoreService: CartStoreService,
              private sharedBooksService: SharedBooksService) {

      this.booksInCart$ = this.cartStoreService.BooksInCart.pipe(
          withLatestFrom(this.sharedBooksService.getBooks()),
          map(([cartBooks, books]) => { //todo вынести map отдельным методом
              return cartBooks.map((bookInCart: CartBook) => {
                  const currentBook: Books = books.find(book => book.id === bookInCart.id);
                  return {
                      books: currentBook,
                      count: bookInCart.count
                  }
              })
          })
      )
  }

    updateCart(booksId: BooksId): void {
      this.cartStoreService.updateCart(booksId);
    }

    get BooksInCart(): Observable<BooksAndCount[]> {
      return this.booksInCart$;
    }

}

export interface Books {
    id: number,
    title: string,
    subtitle: string,
    isbn13: string,
    price: number,
    image: string,
    url: string,
}

export interface BookWithCount extends Books {
    count: number
}

export interface BooksAndCount {
    books: Books;
    count: number;
}


