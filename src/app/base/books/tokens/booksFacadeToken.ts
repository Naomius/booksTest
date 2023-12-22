import {InjectionToken} from "@angular/core";
import {IBooksManager} from "../books.component";

export const BooksFacadeToken = new InjectionToken<IBooksManager>('BooksFacadeToken')
