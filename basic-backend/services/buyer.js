import {
    createBuyerLog,
    listBuyersLog,
    listOneBuyerLog,
    deleteOneBuyerLog,
    updateBuyerLog
} from "../models/buyer.js";

export function createBuyer(user) {
    return createBuyerLog(user);
}

export function updateBuyer(user, buyerId) {
    return new Promise((resolve, reject) => {
        updateBuyerLog(user, buyerId).then((buyer) => {
                resolve(buyer);
        }).catch((err) =>{
            reject(err);
        });
    });
}

export function listBuyers() {
    return new Promise((resolve, reject) => {
        listBuyersLog((err, documents) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(documents);
            }
        });
    });
}


export function listOneBuyer(buyerId) {
    return new Promise((resolve, reject) => {
        listOneBuyerLog(buyerId, (err, documents) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(documents[0]);
            }
        });
    });
}


export function deleteOneBuyer(buyerId) {
    return new Promise((resolve, reject) => {
        deleteOneBuyerLog(buyerId, (err, doc) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve('Erfolgreich deleted');
            }
        });
    });
}