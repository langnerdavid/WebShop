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

export function updateOrderLog(user, orderId) {
    return new Promise((resolve, reject) => {
        const currentTimestamp = new Date().toISOString();

        listOneOrderLog(orderId, (err, oldUser) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                const Order = {
                    username: user.username || oldUser.username,
                    password: user.password || oldUser.password,
                    createdAt: oldUser.createdAt,
                    updatedAt: currentTimestamp,
                };

                orderDb.update({ _id: orderId }, { $set: Order }, {}, (err, numReplaced) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve(Order);
                    }
                });
            }});
        });
}


export function listOrdersLog(callback) {
    orderDb.find({}, callback);
}

export function listOneOrderLog(orderId, callback) {
    orderDb.find({_id : orderId}, callback);
}

export function deleteOneOrderLog(orderId, callback) {
    orderDb.remove({_id : orderId}, callback);
}
/*export function createEchoLog(message) {
    const currentTimestamp = new Date().toISOString();
    const doc = {
        message: message,
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp
    };

    return buyerDb.insertAsync(doc);
}

export function queryEchos(containsString) {
    return buyerDb.findAsync(containsString ? {message: new RegExp(containsString)} : {});
}
*/