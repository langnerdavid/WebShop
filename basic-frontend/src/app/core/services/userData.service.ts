import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class userDataService {
  role: string | null = null;
  id: string | null = null;
  password: string | null = null;

  constructor() {
    this.role = localStorage.getItem("role") ?? sessionStorage.getItem("role");
    this.id = localStorage.getItem("id") ?? sessionStorage.getItem("id");
    this.password = localStorage.getItem("password") ?? sessionStorage.getItem("password");
  }

  isSignedIn(): boolean {
    return !(this.role === null || this.id === null || this.password === null);
  }
}
