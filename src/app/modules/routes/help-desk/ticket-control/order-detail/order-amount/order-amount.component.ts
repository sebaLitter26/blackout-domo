import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, Type } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Item, Order, OrderFilter } from '../../../models/order.model';


@Component({
    selector: 'app-order-amount',
    templateUrl: './order-amount.component.html',
    styleUrls: ['./order-amount.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderAmountComponent implements OnInit {

    @Input()
    orderData: Item | null = null;

    data: Item | null = null;
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        if (this.orderData) {
            this.data = this.orderData;
            this.changeDetectorRef.detectChanges();
        }
    }

}
