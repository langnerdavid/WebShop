import {
    createOrderLog,
    listOneOrderLog,
    listOrdersLog, updateOrderLog
} from "../models/order.js";
import {listOneArticle} from "./article.js";
import {calculateTotalAmount, isOneSeller} from "../shared/shared.js"
import {updateSellerLog} from "../models/seller.js";

export async function createOrder(order) {
    const result = await calculateTotalAmount(order);
    const onlyOneSeller = await isOneSeller(order);
    if (result.error || onlyOneSeller.error) {
        return{error: result.error};
    }
    order.totalAmount = result;
    order.seller = isOneSeller.seller;
    return createOrderLog(order);
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