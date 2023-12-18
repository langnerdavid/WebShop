import {Component, inject} from '@angular/core';
import {ApiService} from "../../core/services/api.service";
import {Buyer, Order} from "../../core/types/echo.type";
import {userDataService} from "../../core/services/userData.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  isEditing: boolean = false;
  editLabel: string = "Edit Profile";

  role: string|undefined;

  constructor(private router: Router) {}
  private userDataService = inject(userDataService);
  private apiService = inject(ApiService);
  buyer: Buyer | undefined;
  isBuyer:boolean = true;
  allOrders: Order[] | undefined;
  buyerId:string|null|undefined;
  sellerId:string|null|undefined;

  firstName:string | undefined = 'Max';
  lastName:string | undefined = 'Mustermann';
  brand:string | undefined = 'Musterfirma';
  email:string | undefined = 'musterman@max.de';
  password: string | undefined = 'Test#1234';

  age:number = 69;
  zipCode:number | undefined = 12345;
  city:string | undefined = 'Musterort';
  address:string | undefined = 'Musterstraße 5';
  iban:number = 123456789;


  orders:Order[] = [{"articles":[{"productId":"5b5WGEyRbK5urrS2","quantity":2}],"buyer":"w7MuumcIqxDj51ul","totalAmount":1580.02,"status":"placed","orderDate":"2023-12-15T08:06:29.558Z","_id":"JDvJrC2jhssr6kuc"}];

  ngOnInit(){
    this.userDataService.updateData();
    if(this.userDataService.isSignedIn()){
      if(this.userDataService.role === "buyer"){
        this.isBuyer = true;
        this.buyerId = this.userDataService.id;
        if (typeof this.buyerId === 'string') {
          this.apiService.getOneBuyer(this.buyerId).then((data: any) => {
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
      }else if (this.userDataService.role === "seller"){
        this.isBuyer = false;
        this.sellerId = this.userDataService.id;
        if(typeof  this.sellerId === 'string'){
          this.apiService.getOneSeller(this.sellerId).then((data:any)=>{

          });
        }
      }
    }else{
      //TODO weiterleitung 404 (sollte nicht auf die Profil Seite können, wenn man nicht angemeldet ist
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

  logOut():void{
    this.userDataService.deleteAll();
    this.userDataService.updateData();
    this.router.navigate(['']);
  }

}
