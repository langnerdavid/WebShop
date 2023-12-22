import { Component } from '@angular/core';
import {Article} from "../../core/types/echo.type";


@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrls: ['../profile/profile.component.css', './seller-profile.component.css']
})
export class SellerProfileComponent {
  brand = "Brand" ;
  email = "email";
  iban = "DE134";
  articles: Article[] =[];
  sellerResult = false;
}
