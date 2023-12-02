import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userData = {
    username: '',
    email: '',
    password: '',
    userType: ''
  };

  userTypes = [
    { label: 'Verkäufer', value: 'seller' },
    { label: 'Käufer', value: 'buyer' }
  ];

  onSubmit() {
    if (!this.userData.userType) {
      console.error('Bitte wählen Sie eine Nutzerrolle aus.');
      return;
    }

    //Registrierungslogik
    //Werte noch in DB eintragen
    //überprüfen ob username schon exisitert
    console.log('Registrierungsdaten:', this.userData);
  }
}
