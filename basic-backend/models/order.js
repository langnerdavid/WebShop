import {orderDb, sellerDb} from "./databases.js";
import {listOneSellerLog} from "./seller.js";
import {listOneArticle, updateArticle} from "../services/article.js";
import {listOneArticleLog} from "./article.js";


export async function createOrderLog(orderReq){
    for (let i = 0; i < orderReq.articles.length; i++) {
        try {
            const article = await listOneArticle(orderReq.articles[i].productId);
            if (article.stockQuantity - orderReq.articles[i].quantity >= 0) {
                console.log({stockQuantity: (article.stockQuantity - orderReq.articles[i].quantity)});
                await updateArticle({stockQuantity: (article.stockQuantity - orderReq.articles[i].quantity)}, orderReq.articles[i].productId);
            } else {
                return{error: 'There was a Problem with your Order, Not enough Items left in Stock'};
            }
        } catch (error) {
            console.error('Error updating stock:', error.message);
            return error.message;
        }
    }
    const currentTimestamp = new Date().toISOString();
    const order = {
        articles: orderReq.articles,
        buyer: orderReq.buyer,
        totalAmount: orderReq.totalAmount,
        status: orderReq.status,
        seller: orderReq.seller,

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