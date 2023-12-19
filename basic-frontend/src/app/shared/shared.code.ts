import {CartPost} from "../core/types/echo.type";
import {userDataService} from "../core/services/userData.service";
import {ApiService} from "../core/services/api.service";

export function getPostHeader():RequestInit{
  return {
    method: 'POST' ,
    headers: {
      'Content-Type': 'application/json'
    }
  };
}
export function getPostHeaderAuthorized(username:string, password:string):RequestInit{
  return {
    method: 'POST' ,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${username}:${password}`)
    }
  };
}

export function getPatchHeader(username:string, password:string):RequestInit{
  return {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${username}:${password}`)
    }
  };
}

export function getDeleteHeader(username:string, password:string):RequestInit{
  return {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(`${username}:${password}`)
    }
  };
}

export async function handleResponse(response: Response): Promise<any> {
  if (response.ok) {
    return response.json();
  }

  const errorText = await response.text();
  console.log('Error caught in Service:', response.status, errorText);
  return { error: response.status, errorText };
}

export function updateCart(productId: string, quantity: number, inCart:boolean, userDataService: userDataService, apiService: ApiService){
  if(userDataService.isSignedIn()){
    let cart:CartPost={
      articles: [{
        productId: productId,
        quantity: quantity
      }]
    };
    apiService.getOneCart(userDataService.id).then((data:any)=>{
      if(data.error === 400){
        apiService.postCart(<string>userDataService.id, <string>userDataService.password, {cart: cart}).then((data:any)=>{
          console.log(data);
        });
      }else if(data.error){
        //TODO was wenn error
      }else{
        cart = { articles: [...(data.articles as { productId: string; quantity: number }[])] };
        let isExecuted=false;
        //TODO there is currently a problem with this for loop
        for(let i = 0; i<cart.articles.length; i++){
          if(cart.articles[i].productId === productId){
            if(inCart){
              cart.articles[i].quantity = quantity;
            }else{
              cart.articles[i].quantity += quantity;
            }
            isExecuted=true;
          }
        }console.log(cart);
        if(!isExecuted){
          let cartPatch={
            productId: productId,
            quantity: quantity
          }
          cart.articles.push(cartPatch);
        }
        console.log(cart);
        //TODO cart gibts schon
        apiService.patchCart(<string>userDataService.id, <string>userDataService.password, {cart: cart}).then((data:any) =>{
          console.log(data);
        });
      }
    });
  }else{
    userDataService.setCartNotSignedIn(productId, quantity, inCart);
  }
}

export function updateFullCart(cart: { articles:{productId: string, quantity:number}[] }, userDataService: userDataService, apiService: ApiService){
  if(userDataService.isSignedIn()){
    apiService.getOneCart(userDataService.id).then((data:any)=>{
      if(data.error === 400){
        apiService.postCart(<string>userDataService.id, <string>userDataService.password, {cart: cart}).then((data:any)=>{
          console.log(data);
        });
      }else if(data.error){
        //TODO was wenn error
      }else{
        cart = { articles: [...(data.articles as { productId: string; quantity: number }[])] };
        //TODO cart gibts schon
        apiService.patchCart(<string>userDataService.id, <string>userDataService.password, {cart: cart}).then((data:any) =>{
          console.log(data);
        });
      }
    });
  }else{
    userDataService.setFullCartNotSignedIn(cart);
  }
}
