import {Component, inject} from '@angular/core';
import {ApiService} from "../../core/services/api.service";
import {UserLogin} from "../../core/types/echo.type";
import {Message} from "primeng/api";
import { userDataService } from 'src/app/core/services/userData.service';
import {Router} from "@angular/router";
import {updateCartSignedIn} from "../../shared/shared.code";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['../register/register.component.css', './signin.component.css']
})

export class SigninComponent {
  private apiService = inject(ApiService);
  private userDataService = inject(userDataService);
  constructor(private router: Router) {}

  messages: Message[] = [];
  userType: any;
  staySignedIn: boolean | undefined;
  error:string = 'User does not exist';

  userData: UserLogin = {
    email: '',
    password: ''
  };

  userTypes: { label: string, value: string }[] = [
    { label: 'Buyer', value: 'Buyer' },
    { label: 'Seller', value: 'Seller' },
  ];

  onSignIn() {
    if (!this.userType) {
      this.error='Choose a role!';
    }else if(this.userType.value === 'Buyer'){
      this.apiService.loginBuyer({user: this.userData}).then((data:any)=>{
        if(data.error){
          this.error = data.errorText;
          this.messages = [{ severity: 'error', summary: 'Error', detail: this.error}];
        }else{

          if(this.staySignedIn){
            localStorage.setItem("role","buyer");
            localStorage.setItem("id",data._id);
            localStorage.setItem("password", data.password);
          }else{
            sessionStorage.setItem("role","buyer");
            sessionStorage.setItem("id",data._id);
            sessionStorage.setItem("password", data.password);
          }
          this.userDataService.updateData();
          if(this.userDataService.cart){
            let cart = JSON.parse(this.userDataService.cart);
            updateCartSignedIn(cart, false, this.userDataService, this.apiService).then(()=>{
              this.router.navigate(['']).then();
            });
          }else{
            this.router.navigate(['']).then();
          }

        }
      });
    }
    else{
      this.apiService.loginSeller({user: this.userData}).then((data:any)=>{
        if(data.error){
          this.error = data.errorText;
          this.messages = [{ severity: 'error', summary: 'Error', detail: this.error}];
        }else{
          if(this.staySignedIn){
            localStorage.setItem("role","seller");
            localStorage.setItem("id",data._id);
            localStorage.setItem("password", data.password);
          }else{
            sessionStorage.setItem("role","seller");
            sessionStorage.setItem("id",data._id);
            sessionStorage.setItem("password", data.password);
          }
          this.userDataService.updateData();
          this.router.navigate(['']).then();


        }
      });
    }
  }
}
/*[Log] Response (default-src_app_core_services_api_service_ts.js, line 207)

body: ReadableStream {locked: true, cancel: function, getReader: function, pipeTo: function, pipeThrough: function, …}

bodyUsed: true

headers: Headers {append: function, delete: function, get: function, getSetCookie: function, has: function, …}

ok: true

redirected: false

status: 200

statusText: "OK"

type: "cors"

url: "http://localhost:3000/api/seller/login"

Response Prototyp
*/
