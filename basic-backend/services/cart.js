import {createCartLog, deleteOneCartLog, listCartLog, listOneCartLog, updateCartLog} from "../models/cart.js";
import {calculateTotalAmount} from "../shared/shared.js";

export async function createCart(cart) {
    const result = await calculateTotalAmount(cart);
    if (result.error) {
        return{error: result.error};
    }
    cart.totalAmount = result;
    return createCartLog(cart);
}

export function updateCart(cartReq, cartId) {
    return new Promise((resolve, reject) => {
        calculateTotalAmount(cartReq).then((totalAmount)=>{
            if(totalAmount.error){
                reject(totalAmount.error);
            }else if(totalAmount > 0){
                cartReq.totalAmount = totalAmount;
            }
            updateCartLog(cartReq, cartId).then((cart) => {
                resolve(cart);
            }).catch((err) =>{
                reject(err);
            });
        });
    });
}

export function listCarts() {
    return new Promise((resolve, reject) => {
        listCartLog((err, carts) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(carts);
            }
        });
    });
}


export function listOneCart(cartId) {
    return new Promise((resolve, reject) => {
        listOneCartLog(cartId, (err, cart) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(cart[0]);
            }
        });
    });
}

export function deleteOneCart(cartId) {
    return new Promise((resolve, reject) => {
        deleteOneCartLog(cartId, (err, doc) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve('Erfolgreich deleted');
            }
        });
    });
}