import { orderDb } from "./databases.js";


export function createOrderLog(orderReq){
    const currentTimestamp = new Date().toISOString();
    const order = {
        articles: orderReq.articles,
        buyer: orderReq.buyer,
        totalAmount: orderReq.totalAmount,
        status: orderReq.status,

        orderDate: currentTimestamp,
    };
    return orderDb.insertAsync(order);
}


export function listOrdersLog(callback) {
    orderDb.find({}, callback);
}

export function listOneOrderLog(orderId, callback) {
    orderDb.find({_id : orderId}, callback);
}