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

export async function updateCartSignedIn(productId: string, quantity: number, inCart: boolean, userDataService: userDataService, apiService: ApiService) {
  let cart: CartPost = {
    articles: [{
      productId: productId,
      quantity: quantity
    }]
  };

  try {
    const data: any = await apiService.getOneCart(userDataService.id);

    if (data.error === 400) {
      const postData: any = await apiService.postCart(<string>userDataService.id, <string>userDataService.password, { cart: cart });
      console.log(postData);
    } else if (data.error) {
      // TODO: Handle error
    } else {
      cart = { articles: [...(data.articles as { productId: string; quantity: number }[])] };
      let isExecuted = false;

      for (let i = 0; i < cart.articles.length; i++) {
        if (cart.articles[i].productId === productId) {
          if (inCart) {
            cart.articles[i].quantity = quantity;
          } else {
            cart.articles[i].quantity += quantity;
          }
          isExecuted = true;
        }
      }

      console.log(cart);

      if (!isExecuted) {
        const cartPatch = {
          productId: productId,
          quantity: quantity
        };
        cart.articles.push(cartPatch);
      }

      console.log(cart);

      // TODO: Handle the case when 'patchCart' fails
      const patchData: any = await apiService.patchCart(<string>userDataService.id, <string>userDataService.password, { cart: cart });
      console.log(patchData);
    }
  } catch (error) {
    console.error('Error:', error);
    // TODO: Handle the error appropriately
  }
}


export async function updateFullCartSignedIn(cartItems:{id: number, productId:string, name: string, price: number, quantity: number, total:number}[],userDataService: userDataService, apiService: ApiService):Promise<any>{
  apiService.getOneCart(userDataService.id).then((data: any) => {
  if (!data.error) {
    let oldCart: { articles: { productId: string; quantity: number }[] } = data;
    let newCart: { articles: { productId: string; quantity: number }[] }={articles:[]};

    cartItems.forEach((cartItem) => {
      let existingCartItem = oldCart.articles.find((item) => item.productId === cartItem.productId);

      if (existingCartItem) {
        existingCartItem.quantity = cartItem.quantity;
      }
      newCart.articles.push(<{productId: string, quantity: number}>existingCartItem);
    });
    console.log(newCart);
    apiService.patchCart(<string>userDataService.id, <string>userDataService.password, {cart: newCart}).then((data:any)=>{
      console.log(data);
      return data;
    });
  }else{
    return data.error
  }
});
}
