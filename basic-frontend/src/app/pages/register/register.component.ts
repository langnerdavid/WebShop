import { Component } from '@angular/core';

interface UserData {
  userType: { label: string, value: string } | null;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  brandName?: string;
  address: string;
  zipcode: string;
  city: string;
  iban: string;
}


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  userData: UserData = {
    userType: null,
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    brandName: '',
    address: '',
    zipcode: '',
    city: '',
    iban: '',
  };

  userTypes: { label: string, value: string }[] = [
    { label: 'Buyer', value: 'Buyer' },
    { label: 'Seller', value: 'Seller' },
  ];

  onSubmit() {
    if (!this.userData.userType) {
      console.error('Bitte wählen Sie eine Nutzerrolle aus.');
      return;
    }

    //TODO:
    // Registrierungslogik
    // Werte noch in DB eintragen
    // überprüfen ob username schon exisitert
    console.log('Registrierungsdaten:', this.userData);
  }
}
