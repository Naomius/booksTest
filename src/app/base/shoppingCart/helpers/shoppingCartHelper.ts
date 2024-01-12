import {map, Observable} from "rxjs";
import {BookWithCount} from "../../../core/services/facadesManagement/shopping-cart.facade.service";

export class ShoppingCartHelper {
    public static calculateTotals(books$: Observable<BookWithCount[]>) : Observable<BookPriceAndCount> {
        return books$.pipe(
            map((books$: BookWithCount[]) => books$.reduce((acc: BookPriceAndCount, book: BookWithCount): BookPriceAndCount => {
                    return {
                        count: acc.count + book.count,
                        price: acc.price + book.price * book.count
                    };
                }, { count: 0, price: 0 }
            ))
        )
    }
}

export interface BookPriceAndCount {
    count: number,
    price: number,
}
