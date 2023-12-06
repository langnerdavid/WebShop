import {
    createOrderLog,
    deleteOneOrderLog,
    listOneOrderLog,
    listOrdersLog,
    updateOrderLog
} from "../models/order.js";
import {listOneArticle} from "./article.js";

export async function createOrder(order) {
    let totalAmount = 0;
    for (let i = 0; i < order?.articles.length; i++) {
        const [article] = await listOneArticle(order.articles[i].productId);
        console.log(article);
        if (article?.price) {
            totalAmount += (article.price * order.articles[i].quantity);
        } else {
            return { error: `Product with productId: ${order.articles[i].productId} does not exist` };
        }
    }
    order.totalAmount = totalAmount;
    return createOrderLog(order);
}

export function updateOrder(user, orderId) {
    return new Promise((resolve, reject) => {
        updateOrderLog(user, orderId).then((Order) => {
                resolve(Order);
        }).catch((err) =>{
            reject(err);
        });
    });
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
                resolve(documents);
            }
        });
    });
}

export function deleteOneOrder(orderId) {
    return new Promise((resolve, reject) => {
        deleteOneOrderLog(orderId, (err, doc) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve('Erfolgreich deleted');
            }
        });
    });
}