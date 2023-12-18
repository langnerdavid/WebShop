import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class userDataService {
  role: string | null = null;
  id: string | null = null;
  password: string | null = null;
  cart: string | null = null;

  constructor() {
    this.role = localStorage.getItem("role") ?? sessionStorage.getItem("role");
    this.id = localStorage.getItem("id") ?? sessionStorage.getItem("id");
    this.password = localStorage.getItem("password") ?? sessionStorage.getItem("password");
    this.cart = localStorage.getItem("cart");
  }
  isSignedIn(): boolean {
    return !(this.role === null || this.id === null || this.password === null);
  }

  updateData(){
    this.role = localStorage.getItem("role") ?? sessionStorage.getItem("role");
    this.id = localStorage.getItem("id") ?? sessionStorage.getItem("id");
    this.password = localStorage.getItem("password") ?? sessionStorage.getItem("password");
    this.cart = localStorage.getItem("cart");
    //TODO Update header
  }

  deleteAll(){
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    localStorage.removeItem("password");

    sessionStorage.removeItem("role");
    sessionStorage.removeItem("id");
    sessionStorage.removeItem("password");
  }
}
