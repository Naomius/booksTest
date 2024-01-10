import {map, Observable} from "rxjs";
import {BookWithCount} from "../../../core/services/facadesManagement/shopping-cart.facade.service";

export class ShoppingCartHelper {
    public static calculateTotals(books$: Observable<BookWithCount[]>) : Observable<BookTotalPrice> {
        return books$.pipe(
            map((books$: BookWithCount[]) => books$.reduce((acc: BookTotalPrice, book: BookWithCount): BookTotalPrice => {
                    return {
                        count: acc.count + book.count,
                        price: acc.price + book.price * book.count
                    };
                }, { count: 0, price: 0 }
            ))
        )
    }
}

export interface BookTotalPrice {
    count: number,
    price: number,
}
