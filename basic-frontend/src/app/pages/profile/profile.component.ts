import {Component, inject} from '@angular/core';
import {ApiService} from "../../core/services/api.service";
import {Buyer, Order} from "../../core/types/echo.type";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  isEditing: boolean = false;
  editLabel: string = "Edit Profile";

  role: string|undefined;

  private apiService = inject(ApiService);
  buyer: Buyer | undefined;
  allOrders: Order[] | undefined;
  buyerId:string|null|undefined;

  firstName:string | undefined = 'Max';
  lastName:string | undefined = 'Mustermann';
  email:string | undefined = 'musterman@max.de';
  password: string | undefined = 'Test#1234';

  age:number = 69;
  zipCode:number | undefined = 12345;
  city:string | undefined = 'Musterort';
  address:string | undefined = 'Musterstraße 5';
  iban:number = 123456789;


  orders:Order[] = [{"articles":[{"productId":"5b5WGEyRbK5urrS2","quantity":2}],"buyer":"w7MuumcIqxDj51ul","totalAmount":1580.02,"status":"placed","orderDate":"2023-12-15T08:06:29.558Z","_id":"JDvJrC2jhssr6kuc"}];

  ngOnInit(){
    this.buyerId = sessionStorage.getItem("id") || localStorage.getItem("id");
    console.log(this.buyerId);
    if (typeof this.buyerId === 'string') {
      this.apiService.getOneBuyer(this?.buyerId).then((data: any) => {
        this.buyer = data;
        this.firstName = this.buyer?.firstName;
        this.lastName = this.buyer?.lastName;
        this.email = this.buyer?.email;
        this.password = this.buyer?.password;
        this.zipCode = this.buyer?.zipCode;
        this.city = this.buyer?.city;
        this.address =this.buyer?.address;

      });
    } else {
      //TODO weiterleitung zum login, darf eigentlich nicht passieren
      console.error("this.buyerId is not a string");
    }

    this.apiService.getAllOrders().then(((data:Order[])=>{
      this.allOrders = data;
      this.orders = this.allOrders.filter(order => order.buyer === this.buyerId);

    }))
  }

  onEditProfile() {
    this.isEditing = true;
    this.editLabel = "Save Changes";
  }

  onSaveChanges() {
    this.isEditing = false;
    this.editLabel = "Edit Profile";
  }


}
