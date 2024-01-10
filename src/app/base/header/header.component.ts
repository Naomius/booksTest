import { Component } from '@angular/core';
import {CartStoreService} from "../../core/services/cartStore.service";
import { map, Observable} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    constructor(private cartService: CartStoreService) {
    }

    getTotalAmount(): Observable<number> {
        return this.cartService.booksInCart.pipe(
            map(bookInCart => bookInCart.reduce((sum, book) => sum + (book.count || 0), 0))
        );
    }
}
