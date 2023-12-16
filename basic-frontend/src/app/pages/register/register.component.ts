import {Component, inject} from '@angular/core';
import {ApiService} from "../../core/services/api.service";
import {Buyer, BuyerPost, SellerPost} from "../../core/types/echo.type";
import {shakeAnimation} from "../../shared/animations";
import {Message} from "primeng/api";

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
  styleUrls: ['./register.component.css'],
  animations: [shakeAnimation]
})

export class RegisterComponent {
  private apiService = inject(ApiService);
  messages: Message[] = [];
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

    else if(!parseInt(this.userData.zipcode, 10)){
      console.error('Bitte geben sie eine korrekte PLZ an.');
      return;
    }
    else if (this.userData.userType.value === 'Buyer' && this.userData.firstName && this.userData.lastName){
      let buyer: BuyerPost = {
        password: this.userData.password,
        email: this.userData.email,
        firstName: this.userData.firstName,
        lastName: this.userData.lastName,
        iban: this.userData.iban,
        address: this.userData.address,
        zipCode: parseInt(this.userData.zipcode, 10),
        city: this.userData.city,
      }
      this.apiService.postBuyer({user: buyer}).then((data:any)=>{
        console.log(data);
        if(data.error){
          console.log(data.error);
          this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText }];
        }else{
          // Weiterleitung und speichern der Zugangsdaten nach erfolgreichem Registrieren
        }
      })
    }else if (this.userData.userType.value === 'Seller' && this.userData.brandName){
      let seller: SellerPost = {
        password: this.userData.password,
        email: this.userData.email,
        brand: this.userData.brandName,
        iban: this.userData.iban,
        address: this.userData.address,
        zipCode: parseInt(this.userData.zipcode, 10),
        city: this.userData.city,
      }
      this.apiService.postSeller({user: seller}).then((data:any)=>{
        console.log(data);
        if(data.error){
          console.log(data.error);
          this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText }];
        }else{
          // Weiterleitung und speichern der Zugangsdaten nach erfolgreichem Registrieren
        }
      })

    }
  }
}
