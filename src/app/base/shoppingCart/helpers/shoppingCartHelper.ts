import {map, Observable} from "rxjs";
import {CartBookDetails} from "../../../core/services/cartStore.service";

export class ShoppingCartHelper {
    public static _calculateTotals(books$: Observable<CartBookDetails[]>) : Observable<{ count: number; price: number }> {
        return books$.pipe(
            map((books$: CartBookDetails[]) => books$.reduce((acc, book) => {
                    return {
                        count: acc.count + book.count,
                        price: acc.price + book.price * book.count
                    };
                }, { count: 0, price: 0 }
            ))
        )
    }
}
