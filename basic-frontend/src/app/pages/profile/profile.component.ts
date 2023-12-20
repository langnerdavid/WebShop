import {Component, inject} from '@angular/core';
import {ApiService} from "../../core/services/api.service";
import {Buyer, BuyerPatch, Order, Seller, SellerPatch} from "../../core/types/echo.type";
import {userDataService} from "../../core/services/userData.service";
import {Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ProfileComponent {
  //test article for profile page
  articles:{id:number, name: string, quantity: number, price: number, productId: string}[] = [];

  //also for testing purposes
  orders2 = [
    { id: 1, status: 'eingegangen', customer: 'Kunde 1', productCount: 5, total: 100.00 },
    { id: 2, status: 'eingegangen', customer: 'Kunde 2', productCount: 3, total: 75.00 },
    { id: 3, status: 'bezahlt', customer: 'Kunde 3', productCount: 2, total: 50.00 },
    { id: 4, status: 'bezahlt', customer: 'Kunde 4', productCount: 6, total: 120.00 },
    { id: 5, status: 'abgeschlossen', customer: 'Kunde 5', productCount: 1, total: 25.00 }
  ];

  eingegangenOrders = this.orders2.filter(order => order.status === 'eingegangen');
  bezahltOrders = this.orders2.filter(order => order.status === 'bezahlt');
  abgeschlossenOrders = this.orders2.filter(order => order.status === 'abgeschlossen');
  //testing end

  isEditing = false;
  editLabel = "Edit Profile";

  role: string|undefined;

  constructor(private router: Router, private userDataService:userDataService, private apiService:ApiService, private confirmationService: ConfirmationService, private messageService: MessageService) {}
  buyer: Buyer | undefined;
  seller: Seller | undefined;
  isBuyer:boolean = true;
  allOrders: Order[] | undefined;
  buyerId:string ='';
  sellerId:string='';

  firstName:string | undefined = 'Max';
  lastName:string | undefined = 'Mustermann';
  brand:string | undefined = 'Musterfirma';
  email:string | undefined = 'musterman@max.de';
  password: string  = 'Test#1234';

  zipCode:number | undefined = 12345;
  city:string | undefined = 'Musterort';
  address:string | undefined = 'Musterstraße 5';
  iban:string | undefined  = '123456789';

  buyerPatch: BuyerPatch ={
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    password: this.password,
    zipCode:this.zipCode,
    city:this.city,
    address: this.address,
    iban: this.iban

  }
  sellerPatch: SellerPatch ={
    brand: this.brand,
    email: this.email,
    password: this.password,
    zipCode:this.zipCode,
    city:this.city,
    address: this.address,
    iban: this.iban

  }

  orders:Order[] = [{"articles":[{"productId":"5b5WGEyRbK5urrS2","quantity":2}],"buyer":"w7MuumcIqxDj51ul","totalAmount":1580.02,"status":"placed","orderDate":"2023-12-15T08:06:29.558Z","_id":"JDvJrC2jhssr6kuc"}];
  ngOnInit(){
    this.isBuyer = this.userDataService.isBuyer();

    this.userDataService.updateData();
    if(this.userDataService.isSignedIn()){
      if(this.isBuyer){
        this.buyerId = <string>this.userDataService.id;
        this.apiService.getOneBuyer(this.buyerId).then((data: any) => {
          this.buyer = data;
          this.firstName = this.buyer?.firstName;
          this.lastName = this.buyer?.lastName;
          this.email = this.buyer?.email;
          this.password = <string>this.buyer?.password;
          this.zipCode = this.buyer?.zipCode;
          this.city = this.buyer?.city;
          this.address = this.buyer?.address;
          this.iban = this.buyer?.iban;

        });
      }else{
        this.sellerId = <string>this.userDataService.id;
        this.apiService.getOneSeller(this.sellerId).then((data: any) => {
          this.seller = data;
          this.brand = this.seller?.brand;
          this.email = this.seller?.email;
          this.password = <string>this.seller?.password;
          this.zipCode = this.seller?.zipCode;
          this.city = this.seller?.city;
          this.address = this.seller?.address;
          this.iban = this.seller?.iban;

        });
        this.apiService.getAllArticles().then((data:any)=>{
          if(!data.error){
            console.log(data);
            const filteredArticles = data.filter((article: { seller: string | null; }) => article.seller === this.userDataService.id);
            for(let i = 0; filteredArticles.length; i++){
              let article ={
                id: i,
                name:filteredArticles[i].title,
                price:filteredArticles[i].price,
                quantity:filteredArticles[i].stockQuantity,
                productId: filteredArticles[i]._id,
              }
              this.articles.push(article);
            }
          }
        });
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
    if(this.isBuyer){
      this.buyerPatch.firstName = this.firstName;
      this.buyerPatch.lastName = this.lastName;
      this.buyerPatch.email = this.email;
      this.buyerPatch.password = this.password;
      this.buyerPatch.zipCode = this.zipCode;
      this.buyerPatch.city = this.city;
      this.buyerPatch.address = this.address;
      this.buyerPatch.iban = this.iban;

      this.apiService.patchBuyer(this.buyerId, this.password, {user: <Buyer>this.buyerPatch}).then((data:any) => {
        if(data.error){
          console.log(data.errorText);
          return
        }else{
          console.log(data);
          this.buyer = data;
          this.firstName = this.buyer?.firstName;
          this.lastName = this.buyer?.lastName;
          this.email = this.buyer?.email;
          this.password = <string>this.buyer?.password;
          this.zipCode = this.buyer?.zipCode;
          this.city = this.buyer?.city;
          this.address = this.buyer?.address;
        }

      });
    }else{
      this.sellerPatch.brand = this.brand;
      this.sellerPatch.email = this.email;
      this.sellerPatch.password = this.password;
      this.sellerPatch.zipCode = this.zipCode;
      this.sellerPatch.city = this.city;
      this.sellerPatch.address = this.address;
      this.sellerPatch.iban = this.iban;

      this.apiService.patchSeller(this.sellerId, this.password, {user: <Seller>this.sellerPatch}).then((data:any) => {
        if(data.error){
          console.log(data.errorText);
          return
        }else{
          this.seller = data;
          this.brand = this.seller?.brand;
          this.email = this.seller?.email;
          this.password = <string>this.seller?.password;
          this.zipCode = this.seller?.zipCode;
          this.city = this.seller?.city;
          this.address = this.seller?.address;
        }

      });
    }
    this.editLabel = "Edit Profile";
  }

  logOut():void{
    this.userDataService.deleteAll();
    this.userDataService.updateData();
    this.router.navigate(['']);
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete your account?',
      rejectButtonStyleClass: 'p-button-danger p-button-sm',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        if(this.isBuyer){
          this.apiService.deleteBuyer(this.buyerId, this.password).then((data:any)=>{
            if(data.ok){
              this.userDataService.deleteAll();
              this.router.navigate(['']);
            }else{
              console.log(data);
            }
          });
        }else{
          this.apiService.deleteSeller(this.sellerId, this.password).then((data:any)=>{
            if(data.ok){
              this.userDataService.deleteAll();
              this.router.navigate(['']);
            }else{
              console.log(data);
            }

          });
        }
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }



}
