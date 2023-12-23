import {Component} from '@angular/core';
import {ApiService} from "../../core/services/api.service";
import {Buyer, BuyerPatch, OrderStatus, Seller, SellerPatch} from "../../core/types/echo.type";
import {userDataService} from "../../core/services/userData.service";
import {Router} from "@angular/router";
import {ConfirmationService, Message, MessageService} from "primeng/api";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ProfileComponent {
  //test article for profile page
  articles:{id:number, name: string, quantity: number, price: number, productId: string, visible: boolean}[] = [];
  listedArticles =this.articles.filter(article => (article.quantity !== 0 && article.visible));
  outOfStockArticles =this.articles.filter(article => article.quantity === 0);
  hiddenArticles =this.articles.filter(article => !article.visible);

  orderBuyer:{id:number, orderDate: Date, status: OrderStatus, seller: string, productCount: number, total: number, orderId: string}[] = [];

  toBePayedOrdersBuyer = this.orderBuyer.filter(order => order.status === 'placed');
  payedOrdersBuyer = this.orderBuyer.filter(order => order.status === 'shipped');

  //also for testing purposes
  ordersSeller:{id:number, status: OrderStatus, buyer: string, productCount: number, total: number, orderId: string}[] = [];

  placedOrders = this.ordersSeller.filter(order => order.status === 'placed');
  payedOrders = this.ordersSeller.filter(order => order.status === 'payed');
  shippedOrders = this.ordersSeller.filter(order => order.status === 'shipped');
  deliveredOrders = this.ordersSeller.filter(order => order.status === 'delivered');
  canceledOrders = this.ordersSeller.filter(order => order.status === 'canceled');

  //testing end

  isEditing = false;
  editLabel = "Edit Profile";

  role: string|undefined;

  constructor(private router: Router, private userDataService:userDataService, private apiService:ApiService, private confirmationService: ConfirmationService, private messageService: MessageService) {}
  buyer: Buyer | undefined;
  seller: Seller | undefined;
  isBuyer:boolean = true;
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

  messages: Message[]=[];

    ngOnInit(){
    this.isBuyer = this.userDataService.isBuyer();

    this.userDataService.updateData();
    if(this.userDataService.isSignedIn()){
      if(this.isBuyer){
        this.buyerId = <string>this.userDataService.id;
        this.apiService.getOneBuyer(this.buyerId).then((data: any) => {
          if(!data.error) {
            this.buyer = data;
            this.firstName = this.buyer?.firstName;
            this.lastName = this.buyer?.lastName;
            this.email = this.buyer?.email;
            this.password = <string>this.buyer?.password;
            this.zipCode = this.buyer?.zipCode;
            this.city = this.buyer?.city;
            this.address = this.buyer?.address;
            this.iban = this.buyer?.iban;
          }else{
            this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
          }

        });
        this.getOrdersBuyer().then();
      }else{
        this.sellerId = <string>this.userDataService.id;
        this.apiService.getOneSeller(this.sellerId).then((data: any) => {
          if(!data.error) {
            this.seller = data;
            this.brand = this.seller?.brand;
            this.email = this.seller?.email;
            this.password = <string>this.seller?.password;
            this.zipCode = this.seller?.zipCode;
            this.city = this.seller?.city;
            this.address = this.seller?.address;
            this.iban = this.seller?.iban;
          }else{
            this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
          }

        });
        this.getArticlesSeller().then();
        this.getOrdersSeller().then();
      }
    }else{
      //TODO weiterleitung 404 (sollte nicht auf die Profil Seite können, wenn man nicht angemeldet ist
    }
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
          this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
          return
        }else{
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
          this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
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
    this.router.navigate(['']).then();
  }

  confirmDeleteAccount(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to delete your account?',
      rejectButtonStyleClass: 'p-button-danger p-button-sm',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        if(this.isBuyer){
          this.apiService.deleteBuyer(this.buyerId, this.password).then((data:any)=>{
            if(!data.error){
              this.userDataService.deleteAll();
              this.router.navigate(['']).then();
            }else{
              this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
              return
            }
          });
        }else{
          this.apiService.deleteSeller(this.sellerId, this.password).then((data:any)=>{
            if(!data.error){
              this.userDataService.deleteAll();
              this.router.navigate(['']).then();
            }else{
              this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
              return;
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
        const filteredArticles = data.filter((article: { seller: string | null; }) => article.seller === this.userDataService.id);
        for(let i = 0; i<filteredArticles.length; i++){
          let article ={
            id: i,
            name:filteredArticles[i].title,
            price:filteredArticles[i].price,
            quantity:filteredArticles[i].stockQuantity,
            productId: filteredArticles[i]._id,
            visible: filteredArticles[i].visible
          }
          this.articles.push(article);
          this.updateArticlesView();
        }
      }else{
        this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
        return;
      }
    });
  }

  confirmPayed(id:string) {
    this.confirmationService.confirm({
      message: 'Do you really want to confirm the payment of the order',
      rejectButtonStyleClass: 'p-button-danger p-button-sm',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        this.updateOrderDB(id, 'payed').then(()=>{
          const targetIndex = this.ordersSeller.findIndex(order => order.orderId === id);
          this.ordersSeller[targetIndex].status = 'payed';
          this.updateOrdersSellerView();
        });
        // Logik zum Ausführen der Aktion, wenn der Benutzer auf "Ja" klickt
      },
      reject: () => {
        // Logik zum Ausführen der Aktion, wenn der Benutzer auf "Nein" klickt
      }
    });
  }

  orderDetail(orderId: string){
    this.router.navigate(['/orderDetailed', orderId]).then();
  }

  confirmCancel(id:string) {
    this.confirmationService.confirm({
      message: 'Do you really want to cancel the order',
      rejectButtonStyleClass: 'p-button-danger p-button-sm',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        this.updateOrderDB(id, 'canceled').then(()=>{
          const targetIndex = this.ordersSeller.findIndex(order => order.orderId === id);
          this.ordersSeller[targetIndex].status = 'canceled';
          this.updateOrdersSellerView();
        });
        // Logik zum Ausführen der Aktion, wenn der Benutzer auf "Ja" klickt
      },
      reject: () => {
        // Logik zum Ausführen der Aktion, wenn der Benutzer auf "Nein" klickt
      }
    });
  }
  confirmShipped(id:string){
    this.confirmationService.confirm({
      message: 'Do you really want to confirm the shipping of the order',
      rejectButtonStyleClass: 'p-button-danger p-button-sm',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        this.updateOrderDB(id, 'shipped').then(()=>{
          const targetIndex = this.ordersSeller.findIndex(order => order.orderId === id);
          this.ordersSeller[targetIndex].status = 'shipped';
          this.updateOrdersSellerView();
        });
        // Logik zum Ausführen der Aktion, wenn der Benutzer auf "Ja" klickt
      },
      reject: () => {
        // Logik zum Ausführen der Aktion, wenn der Benutzer auf "Nein" klickt
      }
    });

  }
  confirmDelivered(id:string){
    this.confirmationService.confirm({
      message: 'Do you really want to confirm the delivery of the order',
      rejectButtonStyleClass: 'p-button-danger p-button-sm',
      acceptButtonStyleClass: 'p-button-outlined p-button-sm',
      accept: () => {
        this.updateOrderDB(id, 'delivered').then(()=>{
          const targetIndex = this.ordersSeller.findIndex(order => order.orderId === id);
          this.ordersSeller[targetIndex].status = 'delivered';
          this.updateOrdersSellerView();
        });
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
        for(let i = 0; i<filteredOrders.length; i++){
          this.apiService.getOneBuyer(filteredOrders[i].buyer).then((data:any)=>{
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
              this.updateOrdersSellerView();
            }
          });
        }
      }else{
        this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
        return;
      }
    });
  }

  private async getOrdersBuyer(){
    this.apiService.getAllOrders().then((data:any)=>{
      if(!data.error){
        const filteredOrders = data.filter((order:{buyer:string|null})=> order.buyer === this.userDataService.id);
        for(let i = 0; i<filteredOrders.length; i++){
          this.apiService.getOneSeller(filteredOrders[i].seller).then((seller:any)=>{
            if(!seller.error){
              let order={
                id: i,
                status: filteredOrders[i].status,
                seller: seller.brand,
                orderDate: filteredOrders[i].orderDate,
                productCount: filteredOrders[i].articles.length,
                total: filteredOrders[i].totalAmount,
                orderId: filteredOrders[i]._id
              }
              this.orderBuyer.push(order);
              this.updateOrdersBuyerView();
            }
          });
        }
      }else{
        this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
        return;
      }
    });
  }
  private updateOrdersSellerView(){
    this.placedOrders = this.ordersSeller.filter(order => order.status === 'placed');
    this.payedOrders = this.ordersSeller.filter(order => order.status === 'payed');
    this.shippedOrders = this.ordersSeller.filter(order => order.status === 'shipped');
    this.deliveredOrders = this.ordersSeller.filter(order => order.status === 'delivered');
    this.canceledOrders = this.ordersSeller.filter(order => order.status === 'canceled');

  }

  private updateOrdersBuyerView(){
    this.toBePayedOrdersBuyer = this.orderBuyer.filter(order => order.status === 'placed');
    this.payedOrdersBuyer = this.orderBuyer.filter(order => order.status === 'shipped');
  }
  private updateArticlesView(){
    this.listedArticles =this.articles.filter(article => (article.quantity !== 0 && article.visible));
    this.outOfStockArticles =this.articles.filter(article => article.quantity === 0);
    this.hiddenArticles =this.articles.filter(article => !article.visible);

  }

  private async updateOrderDB(orderId: string, status:OrderStatus){
    this.apiService.patchOrder(orderId, <string>this.userDataService.id, <string>this.userDataService.password, {order: {status: status}}).then((data:any)=>{
      if(data.error){
        this.messages = [{ severity: 'error', summary: 'Error', detail: data.errorText}];
        return;
      }
    });
  }
}
