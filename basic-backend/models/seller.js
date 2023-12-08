import { sellerDb } from "./databases.js";
import {listOneSeller} from "../services/seller.js";


export function createSellerLog(user){
    const currentTimestamp = new Date().toISOString();

    const seller = {
        password: user.password,
        email: user.email,
        brand: user.brand,
        address: user.address,
        zipCode: user.zipCode,
        city: user.city,
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp
    };
    return sellerDb.insertAsync(seller);
}

export function updateSellerLog(user, sellerId) {
    return new Promise((resolve, reject) => {
        const currentTimestamp = new Date().toISOString();

        listOneSellerLog(sellerId, (err, oldUser) => {
            oldUser = oldUser[0];
            if (err) {
                console.error(err);
                reject(err);
            } else {
                const seller = {
                    password: user?.password ?? oldUser.password,
                    email: user?.email ?? oldUser.email,
                    brand: user?.brand ?? oldUser.brand,
                    address: user?.address ?? oldUser.address,
                    zipCode: user?.zipCode ?? oldUser.zipCode,
                    city: user?.city ?? oldUser.city,
                    createdAt: oldUser.createdAt,
                    updatedAt: currentTimestamp
                };

                sellerDb.update({ _id: sellerId }, { $set: seller }, {}, (err, numReplaced) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        listOneSellerLog(sellerId, (err, fullyUpdatedSeller) => {
                            oldUser = oldUser[0];
                            if (err) {
                                console.error(err);
                                reject(err);
                            } else {
                                resolve(fullyUpdatedSeller[0]);
                            }
                        });
                    }
                });
            }});
        });
}


export function listSellersLog(callback) {
    sellerDb.find({}, callback);
}

export function listOneSellerLog(sellerId, callback) {
    sellerDb.find({_id : sellerId}, callback);
}
export function deleteOneSellerLog(sellerId, callback) {
    sellerDb.remove({_id : sellerId}, callback);
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