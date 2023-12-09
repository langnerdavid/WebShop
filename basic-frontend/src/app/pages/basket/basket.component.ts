import { Component } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent {
  cartItems = [
    { id: 1, name: 'Produkt 1', price: 10, quantity: 1 },
    { id: 2, name: 'Produkt 2', price: 20, quantity: 2 },
    { id: 3, name: 'Produkt 3', price: 30, quantity: 1 },
  ];

  total: number | undefined;

  constructor() {
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  removeFromCart(itemId: number) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.calculateTotal();
  }
}
