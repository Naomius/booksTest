import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-empty-cart',
  templateUrl: './empty-cart.component.html',
  styleUrls: ['./empty-cart.component.scss']
})
export class EmptyCartComponent {

    @Input() notFoundMessage: string = "Nothing Found!";
    @Input() resetLinkText: string = "Reset";
    @Input() resetLinkRoute: string = "/";

}
