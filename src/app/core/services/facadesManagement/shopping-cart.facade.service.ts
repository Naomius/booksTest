import { Injectable } from '@angular/core';
import {IShoppingCartManager} from "../../../base/shoppingCart/shopping-cart.component";
import {Observable} from "rxjs";
import {CartBookDetails, CartStoreService} from "../cartStore.service";

@Injectable()
export class ShoppingCartFacadeService implements IShoppingCartManager {

  constructor(private cartStoreService: CartStoreService) { }

    addBooksToCart(bookWithCount: BookWithCount): void {
      this.cartStoreService.addToCart(bookWithCount);
    }

    removeBooksFromCart(bookId: number): void {
      this.cartStoreService.removeFromCart(bookId);
    }

    get bookInCart$(): Observable<CartBookDetails[]> {
      return this.cartStoreService.booksInCart$;
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

export interface BookWithCount {
    book: Book,
    count: number
}

