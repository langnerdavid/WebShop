import {
    createOrderLog,
    listOneOrderLog,
    listOrdersLog
} from "../models/order.js";
import {listOneArticle} from "./article.js";
import {calculateTotalAmount} from "../shared/shared.js"

export async function createOrder(order) {
    const result = await calculateTotalAmount(order);
    if (result.error) {
        return{error: result.error};
    }
    order.totalAmount = result;
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