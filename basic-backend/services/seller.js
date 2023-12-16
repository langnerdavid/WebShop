import {
    createSellerLog,
    deleteOneSellerLog, listOneSellerByEmailLog,
    listOneSellerLog,
    listSellersLog,
    updateSellerLog
} from "../models/seller.js";

export function createSeller(user) {
    return createSellerLog(user);
}

export function updateSeller(user, sellerId) {
    return new Promise((resolve, reject) => {
        updateSellerLog(user, sellerId).then((seller) => {
                resolve(seller);
        }).catch((err) =>{
            reject(err);
        });
    });
}

export function listSellers() {
    return new Promise((resolve, reject) => {
        listSellersLog((err, documents) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(documents);
            }
        });
    });
}


export function listOneSeller(sellerId) {
    return new Promise((resolve, reject) => {
        listOneSellerLog(sellerId, (err, documents) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(documents[0]);
            }
        });
    });
}
export function listOneSellerByEmail(email) {
    return new Promise((resolve, reject) => {
        listOneSellerByEmailLog(email, (err, documents) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(documents[0]);
            }
        });
    });
}

export function deleteOneSeller(sellerId) {
    return new Promise((resolve, reject) => {
        deleteOneSellerLog(sellerId, (err, doc) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve('Erfolgreich deleted');
            }
        });
    });
}