import {Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Article, CartPost} from "../../../core/types/echo.type";
import {ApiService} from "../../../core/services/api.service"
import {Router} from "@angular/router";
import {userDataService} from "../../../core/services/userData.service";

@Component({
  selector: 'app-articlepreview',
  templateUrl: './articlepreview.component.html',
  styleUrls: ['./articlepreview.component.css']
})
export class ArticlepreviewComponent implements OnChanges{
  @Input()
  articleInfo: Article | undefined;

  product = {
    id: '1',
    name: 'Beispielprodukt',
    price: 19.99,
    description: 'Dies ist ein Beispielprodukt.',
    image: '../../../../assets/ProfilPic.png',
  };
  stockQuantity: number | undefined;

  constructor(private router: Router, private userDataService: userDataService, private apiService: ApiService) {
    this.initializeProduct();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['articleInfo']) {
      this.initializeProduct();
    }
  }


  private initializeProduct() {
    if (this.articleInfo) {
      this.product.id = this.articleInfo._id;
      this.product.name = this.articleInfo.title;
      this.product.price = this.articleInfo.price;
      this.product.description = this.articleInfo.description;
      this.stockQuantity = this.articleInfo.stockQuantity;
    }
  }


  addToCart(event: Event) {
    event.stopPropagation();
    if(this.userDataService.isSignedIn()){
      this.userDataService.updateData();
      //TODO Datenbank Integration Cart
      let cart:CartPost={
        articles: [{
          productId: this.product.id,
          quantity: 1
        }]
      };
      this.apiService.getOneCart(this.userDataService.id).then((data:any)=>{
        if(data.error === 400){
          this.apiService.postCart(<string>this.userDataService.id, <string>this.userDataService.password, {cart: cart}).then((data:any)=>{
            console.log(data);
          });
        }else if(data.error){
          //TODO was wenn error
        }else{
          cart = data;
          console.log('cart bevor: ', cart.articles)
          let isExecuted=false;
          //TODO there is currently a problem with this for loop
          for(let i = 0; i<data.articles.length; i++){
            if(cart.articles[i].productId === this.product.id){
              console.log(i);
              cart.articles[i].quantity += 1;
              isExecuted=true;
            }
          }
          console.log('cart: ', cart.articles);
          if(!isExecuted){
            let cartPatch={
              productId: this.product.id,
              quantity: 1
            }
            cart.articles.push(cartPatch);
          }
          //TODO cart gibts schon
          this.apiService.patchCart(<string>this.userDataService.id, <string>this.userDataService.password, {cart: cart}).then((data:any) =>{
            console.log(data);
          });
        }
      });
    }else{
      this.userDataService.setCartNotSignedIn(this.product.id, 1);
    }
  }

  onTitleClicked(){
    console.log(this.product.id)
    this.router.navigate(['/article', this.product.id]);
  }

  protected readonly event = event;
}


