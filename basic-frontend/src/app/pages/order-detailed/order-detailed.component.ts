import { Component } from '@angular/core';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.css']
})
export class OrderDetailedComponent {
  order = {
    customer: 'John Doe',
    mail: 'hallo',
    address: '123 Main St',
    iban: 'DE89 3704 0044 0532 0130 00',
    city: 'Berlin',
    zipcode: '10115',
    total: 100,
    products: [
      { id: 1, name: 'Product 1', price: 20, quantity: 2 },
      { id: 2, name: 'Product 2', price: 30, quantity: 1 },
      { id: 3, name: 'Product 3', price: 10, quantity: 5 },
    ],
    status: 'eingegangen',
  };

  statuses = [
    { label: 'Eingegangen', value: 'eingegangen' },
    { label: 'Versendet', value: 'versendet' },
    { label: 'Abgeschlossen', value: 'abgeschlossen' },
  ];

  selectedStatus: string = this.order.status
}
