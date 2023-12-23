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

export function updateCart(cartReq, buyerId) {
    return new Promise((resolve, reject) => {
        calculateTotalAmount(cartReq).then((totalAmount)=>{
            if(totalAmount.error){
                reject(totalAmount.error);
            }else if(totalAmount > 0){
                cartReq.totalAmount = totalAmount;
            }
            updateCartLog(cartReq, buyerId).then((cart) => {
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


export function listOneCart(buyerId) {
    return new Promise((resolve, reject) => {
        listOneCartLog(buyerId, (err, cart) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(cart[0]);
            }
        });
    });
}

export function deleteOneCart(buyerId) {
    return new Promise((resolve, reject) => {
        deleteOneCartLog(buyerId, (err, doc) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve('Erfolgreich deleted');
            }
        });
    });
}