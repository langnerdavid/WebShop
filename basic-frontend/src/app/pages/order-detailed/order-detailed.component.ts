import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ApiService} from "../../core/services/api.service";
import {OrderStatus} from "../../core/types/echo.type";

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.css']
})
export class OrderDetailedComponent {
  orderId:string='';
  order: { customer: string; email: string; address: string; iban: string; city: string; zipCode: string; total: number; products: { id: number; name: string; price: number; quantity: number; }[]; status: OrderStatus; }={
    customer:'Max Mustermann',
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
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
  ];

  selectedStatus: string = this.order.status

  constructor(private route: ActivatedRoute, private apiService:ApiService) {
  }


  ngOnInit(){
    this.route.params.subscribe(params => {
      this.orderId = params['orderId'];
    });
    this.getBuyer().then(()=>{
      console.log('buyer Data aktualisiert');
    });
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
}
