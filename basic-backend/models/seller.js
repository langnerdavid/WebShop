import { sellerDb } from "./databases.js";
import {listOneSeller} from "../services/seller.js";


export function createSellerLog(user){
    const currentTimestamp = new Date().toISOString();

    const seller = {
        username: user.username,
        password: user.password,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,

        createdAt: currentTimestamp,
        updatedAt: currentTimestamp
    };
    return sellerDb.insertAsync(seller);
}

export function updateSellerLog(user, sellerId) {
    return new Promise((resolve, reject) => {
        const currentTimestamp = new Date().toISOString();

        listOneSellerLog(sellerId, (err, oldUser) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                const seller = {
                    username: user.username || oldUser.username,
                    password: user.password || oldUser.password,
                    createdAt: oldUser.createdAt,
                    updatedAt: currentTimestamp,
                };

                sellerDb.update({ _id: sellerId }, { $set: seller }, {}, (err, numReplaced) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve(seller);
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
export function listOneSellerByUsernameLog(username, callback) {
    sellerDb.find({username : username}, callback);
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