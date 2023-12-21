import {orderDb, sellerDb} from "./databases.js";
import {listOneSellerLog} from "./seller.js";


export function createOrderLog(orderReq){
    const currentTimestamp = new Date().toISOString();
    const order = {
        articles: orderReq.articles,
        buyer: orderReq.buyer,
        totalAmount: orderReq.totalAmount,
        status: orderReq.status,
        seller: orderReq.status,

        updatedAt: currentTimestamp,
        orderDate: currentTimestamp
    };
    return orderDb.insertAsync(order);
}


export function listOrdersLog(callback) {
    orderDb.find({}, callback);
}

export function listOneOrderLog(orderId, callback) {
    orderDb.find({_id : orderId}, callback);
}

export function updateOrderLog(orderReq, orderId) {
    return new Promise((resolve, reject) => {
        const currentTimestamp = new Date().toISOString();

        listOneOrderLog(orderId, (err, oldOrder) => {
            oldOrder = oldOrder[0];
            if (err) {
                console.error(err);
                reject(err);
            } else {
                const order = {
                    articles: oldOrder.articles,
                    buyer: oldOrder.buyer,
                    seller: oldOrder.seller,
                    totalAmount: oldOrder.totalAmount,
                    status: orderReq.status,

                    updatedAt: currentTimestamp,
                    orderDate: oldOrder.orderDate
                };

                orderDb.update({ _id: orderId }, { $set: order }, {}, (err, numReplaced) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        listOneOrderLog(orderId, (err, fullyUpdatedOrder) => {
                            if (err) {
                                console.error(err);
                                reject(err);
                            } else {
                                resolve(fullyUpdatedOrder[0]);
                            }
                        });
                    }
                });
            }});
    });
}