import { Injectable } from '@angular/core';
import {Book, BooksCounter} from "../../../base/books/interfaces/IBook";
import {CartStoreService} from "../../../base/services/cartStore.service";
import {IShoppingCartManager} from "../../../base/shoppingCart/shopping-cart.component";

@Injectable()
export class ShoppingCartFacadeService implements IShoppingCartManager {

  constructor(private cartStoreService: CartStoreService) { }

    addBooksToCart(newBook: Book): void {
        this.cartStoreService.addToCart(newBook);
    }

    removeBooksFromCart(bookId: number): void {
        this.cartStoreService.removeFromCart(bookId)
    }

}
