import {Component, inject} from '@angular/core';
import {ApiService} from "../../core/services/api.service";
import {Buyer, BuyerPatch, Order, OrderStatus, Seller, SellerPatch} from "../../core/types/echo.type";
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

  orderBuyer:{id:number, status: OrderStatus, buyer: string, productCount: number, total: number, orderId: string}[] = [];

  toBePayedOrdersBuyer = this.orderBuyer.filter(order => order.status === 'placed');
  payedOrdersBuyer = this.orderBuyer.filter(order => order.status === 'shipped');

  //also for testing purposes
  ordersSeller:{id:number, status: OrderStatus, buyer: string, productCount: number, total: number, orderId: string}[] = [];

  placedOrders = this.ordersSeller.filter(order => order.status === 'placed');
  payedOrders = this.ordersSeller.filter(order => order.status === 'shipped');
  deliveredOrders = this.ordersSeller.filter(order => order.status === 'delivered');
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
        this.getArticlesSeller();
        this.getOrdersSeller();
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


  private async getArticlesSeller(){
    this.apiService.getAllArticles().then((data:any)=>{
      if(!data.error){
        console.log(data);
        const filteredArticles = data.filter((article: { seller: string | null; }) => article.seller === this.userDataService.id);
        for(let i = 0; i<filteredArticles.length; i++){
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

  confirmPaid() {
    this.confirmationService.confirm({
      message: 'Ist die Bestellung wirklch bezahlt? Falls ja müssen Sie dem Buyer das Geld zurücküberweisen/die Überweisung ablehnen!',
      accept: () => {
        // Logik zum Ausführen der Aktion, wenn der Benutzer auf "Ja" klickt
      },
      reject: () => {
        // Logik zum Ausführen der Aktion, wenn der Benutzer auf "Nein" klickt
      }
    });
  }

  orderDetail(orderId: string){
    this.router.navigate(['/orderDetailed', orderId]);
  }

  confirmDeletion() {
    this.confirmationService.confirm({
      message: 'Möchten sie die Bestellung wirklich stornieren?',
      accept: () => {
        // Logik zum Ausführen der Aktion, wenn der Benutzer auf "Ja" klickt
      },
      reject: () => {
        // Logik zum Ausführen der Aktion, wenn der Benutzer auf "Nein" klickt
      }
    });
  }


  private async getOrdersSeller(){
    this.apiService.getAllOrders().then((data:any)=>{
      if(!data.error){
        const filteredOrders = data.filter((order:{seller:string|null})=> order.seller === this.userDataService.id);
        console.log(filteredOrders);
        for(let i = 0; i<filteredOrders.length; i++){
          this.apiService.getOneBuyer(filteredOrders[i].buyer).then((data:any)=>{
            console.log(data);
            if(!data.error){
              let order={
                id: i,
                status: filteredOrders[i].status,
                buyer: data.firstName+' '+data.lastName,
                productCount: filteredOrders[i].articles.length,
                total: filteredOrders[i].totalAmount,
                orderId: filteredOrders[i]._id
              }
              this.ordersSeller.push(order);
              this.updateOrdersView();
            }
          });
        }
      }
    });
  }
  private updateOrdersView(){
    this.placedOrders = this.ordersSeller.filter(order => order.status === 'placed');
    this.payedOrders = this.ordersSeller.filter(order => order.status === 'shipped');
    this.deliveredOrders = this.ordersSeller.filter(order => order.status === 'delivered');
  }
}
