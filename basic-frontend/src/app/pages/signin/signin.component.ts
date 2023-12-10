import { Component } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['../register/register.component.css', './signin.component.css']
})

export class SigninComponent {
  userData = {
    username: '',
    password: ''
  };

  onSignIn() {
    //TODO:
    // Daten mit DB abgleichen
    console.log('Anmeldedaten:', this.userData);
  }
}
