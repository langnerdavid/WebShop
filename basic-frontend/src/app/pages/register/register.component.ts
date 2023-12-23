import {Component, inject} from '@angular/core';
import {ApiService} from "../../core/services/api.service";
import {Buyer, BuyerPost, SellerPost} from "../../core/types/echo.type";
import {shakeAnimation} from "../../shared/animations";
import {Message} from "primeng/api";
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import {userDataService} from "../../core/services/userData.service";

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

  constructor(private router: Router, private userDataService:userDataService) {}

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

  submitted = false;
  onSubmit(form: NgForm) {

    if (!form.valid) {
      this.submitted = true;
      return;
    }

    if (!this.userData.userType) {
      console.error('Bitte wählen Sie eine Nutzerrolle aus.');
      this.messages = [{ severity: 'error', summary: 'Error', detail: 'please select role' }];
      return;

    }

    else if (this.userData.userType.value === 'Buyer' && this.userData.firstName && this.userData.lastName){
      const buyer: BuyerPost = {
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
        if(data.error){
          this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText }];
          return;
        }else{
          if(this.userDataService.cart){
            console.log(JSON.parse(this.userDataService.cart));
            this.apiService.postCart(data._id, data.password, {cart: JSON.parse(this.userDataService.cart)}).then((cart:any)=>{
              if(!cart.error){
                this.userDataService.deleteCartNotSignedIn();
                localStorage.setItem("role","buyer");
                localStorage.setItem("id",data._id);
                localStorage.setItem("password", data.password);
                this.router.navigate(['/profile']);
              }
            });
          }else{
            localStorage.setItem("role","buyer");
            localStorage.setItem("id",data._id);
            localStorage.setItem("password", data.password);
            this.router.navigate(['/profile']);
          }
        }
      })
    }else if (this.userData.userType.value === 'Seller' && this.userData.brandName){
      const seller: SellerPost = {
        password: this.userData.password,
        email: this.userData.email,
        brand: this.userData.brandName,
        iban: this.userData.iban,
        address: this.userData.address,
        zipCode: parseInt(this.userData.zipcode, 10),
        city: this.userData.city,
      }
      this.apiService.postSeller({user: seller}).then((data:any)=>{
        if(data.error){
          this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText }];
        }else{
          localStorage.setItem("role","seller");
          localStorage.setItem("id",data._id);
          localStorage.setItem("password", data.password);
          this.router.navigate(['/profile']);
        }
      })

    }
  }
}
