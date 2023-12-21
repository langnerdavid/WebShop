import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ApiService} from "../../core/services/api.service";
import {CartPatch, Order, OrderStatus} from "../../core/types/echo.type";
import {userDataService} from "../../core/services/userData.service";

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.css']
})
export class OrderDetailedComponent {
  isSeller: boolean = true;
  orderId:string='';
  order: { customer?: string; brand?:string, email: string; address: string; iban: string; city: string; zipCode: string; total: number; products: { id: number; name: string; price: number; quantity: number; }[]; status: OrderStatus; }={
    customer:'Max Mustermann',
    brand: 'Musterfirma',
    email:'muster@email.com',
    address:'Musterstraße',
    iban:'DE345678ui9o',
    city:'Musterstadt',
    zipCode:'12345',
    total:100,
    products:[],
    status:'placed'
  };

  statuses = [
    { label: 'Placed', value: 'placed' },
    { label: 'Payed', value: 'payed' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Canceled', value: 'canceled' }
  ];
  componentLoaded = false;

  selectedStatus: string = this.order.status;
  constructor(private route: ActivatedRoute, private router:Router, private apiService:ApiService, private userDataService:userDataService) {
  }


  ngOnInit(){
    this.route.params.subscribe(params => {
      this.orderId = params['orderId'];
    });
    if(this.userDataService.isSeller()){
      this.isSeller = true;
      this.getBuyer().then(()=>{
        console.log('buyer Data aktualisiert');
      });
    }else{
      this.isSeller = false;
      this.getSeller().then(()=>{
        console.log('Seller Data aktualisiert');
      });
    }
  }
  ngAfterViewInit() {
    // Component and view initialization logic here
    // Set the flag to true once the view has finished initializing
    this.componentLoaded = true;
  }

  onStatusChange(newStatus: OrderStatus, backToProfile:boolean) {
    if(this.componentLoaded){
      this.updateOrderStatus(newStatus).then(()=>{
        if(backToProfile){
          this.router.navigate(['/profile']);
        }else{
          this.order.status = newStatus;
          this.selectedStatus = newStatus;
        }
      });
    }
  }


  async getBuyer(){
    this.apiService.getOneOrder(this.orderId).then((order:any)=>{
      console.log(order);
      if(!order.error){
        this.apiService.getOneBuyer(order.buyer).then((buyer:any)=>{
          if(!buyer.error){
            this.order.customer = buyer.firstName + ' ' + buyer.lastName,
            this.order.email = buyer.email;
            this.order.address = buyer.address;
            this.order.iban = buyer.iban;
            this.order.city = buyer.city;
            this.order.zipCode = buyer.zipCode;
            this.order.total = order.totalAmount;
            this.order.status = order.status;
            this.order.products =[];
            console.log(this.order.status);
            this.selectedStatus = this.order.status;
            for(let i =0; i<order.articles.length; i++){
              this.apiService.getOneArticle(order.articles[i].productId).then((article:any)=>{
                const product ={
                  id: i,
                  name: article.title,
                  price: article.price,
                  quantity: order.articles[i].quantity
                }
                this.order.products.push(product);
              });
            }
          }
        })
      }
    });
  }

  async getSeller(){
    this.apiService.getOneOrder(this.orderId).then((order:any)=>{
      console.log(order);
      if(!order.error){
        this.apiService.getOneSeller(order.seller).then((seller:any)=>{
          console.log('seller: ', seller)
          if(!seller.error){
            this.order.brand = seller.brand;
            this.order.email = seller.email;
            this.order.address = seller.address;
            this.order.iban = seller.iban;
            this.order.city = seller.city;
            this.order.zipCode = seller.zipCode;
            this.order.total = order.totalAmount;
            this.order.status = order.status;
            this.order.products =[];
            console.log(this.order.status);
            this.selectedStatus = this.order.status;
            for(let i =0; i<order.articles.length; i++){
              this.apiService.getOneArticle(order.articles[i].productId).then((article:any)=>{
                const product ={
                  id: i,
                  name: article.title,
                  price: article.price,
                  quantity: order.articles[i].quantity
                }
                this.order.products.push(product);
              });
            }
          }
        })
      }
    });
  }

  async updateOrderStatus(orderStatus: OrderStatus) {
    let order: { status: OrderStatus } = {
      status: orderStatus
    };
    this.apiService.patchOrder(this.orderId,<string>this.userDataService.id, <string>this.userDataService.password, {order: order}).then((data:any)=>{
      console.log(data);
    });
  }
}
