import {
    createOrderLog,
    listOneOrderLog,
    listOrdersLog, updateOrderLog
} from "../models/order.js";
import {calculateTotalAmount, isOneSeller} from "../shared/shared.js"

export async function createOrder(order) {
    const result = await calculateTotalAmount(order);
    const onlyOneSeller = await isOneSeller(order);
    if (result.error || onlyOneSeller.error) {
        return{error: result.error};
    }else{
        order.totalAmount = result;
        order.seller = onlyOneSeller.seller;
        console.log('Seller der Order: ', order.seller);
        return createOrderLog(order);
    }
}


export function listOrders() {
    return new Promise((resolve, reject) => {
        listOrdersLog((err, documents) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(documents);
            }
        });
    });
}


export function listOneOrder(orderId) {
    return new Promise((resolve, reject) => {
        listOneOrderLog(orderId, (err, documents) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(documents[0]);
            }
        });
    });
}

export function updateOrder(orderPatch, orderId) {
    return new Promise((resolve, reject) => {
        updateOrderLog(orderPatch, orderId).then((order) => {
            resolve(order);
        }).catch((err) =>{
            reject(err);
        });
    });
}