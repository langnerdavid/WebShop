import {articleDb, buyerDb, cartDb, orderDb, sellerDb} from "./databases.js";
import {listOneSellerLog} from "./seller.js";


export function createBuyerLog(user){
    const currentTimestamp = new Date().toISOString();
    const buyer = {
        password: user.password,
        email: user.email.toLowerCase(),
        firstName: user.firstName,
        lastName: user.lastName,
        iban : user.iban,
        address: user.address,
        zipCode: user.zipCode,
        city: user.city,

        createdAt: currentTimestamp,
        updatedAt: currentTimestamp
    };
    return buyerDb.insertAsync(buyer);
}

export function updateBuyerLog(user, buyerId) {
    return new Promise((resolve, reject) => {
        const currentTimestamp = new Date().toISOString();

        listOneBuyerLog(buyerId, (err, oldUser) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                const buyer = {
                    password: user?.password ?? oldUser.password,
                    email: user?.email.toLowerCase() ?? oldUser.email,
                    firstName: user?.firstName ?? oldUser.firstName,
                    lastName: user?.lastName ?? oldUser.lastName,
                    iban : user?.iban ?? oldUser.iban,
                    address: user?.address ?? oldUser.address,
                    zipCode: user?.zipCode ?? oldUser.zipCode,
                    city: user?.city ?? oldUser.city,

                    createdAt: oldUser.createdAt,
                    updatedAt: currentTimestamp
                };

                buyerDb.update({ _id: buyerId }, { $set: buyer }, {}, (err, numReplaced) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        listOneBuyerLog(buyerId, (err, fullyUpdatedBuyer) => {
                            oldUser = oldUser[0];
                            if (err) {
                                console.error(err);
                                reject(err);
                            } else {
                                resolve(fullyUpdatedBuyer[0]);
                            }
                        });
                    }
                });
            }});
        });
}


export function listBuyersLog(callback) {
    buyerDb.find({}, callback);
}

export function listOneBuyerLog(buyerId, callback) {
    buyerDb.find({_id : buyerId}, callback);
}
export function listOneBuyerByEmailLog(email, callback) {
    email = email.toLowerCase();
    buyerDb.find({email : email}, callback);
}

export function deleteOneBuyerLog(buyerId, callback) {
    orderDb.remove({ buyer: buyerId }, { multi: true }, (articleErr) => {
        if (articleErr) {
            console.error(articleErr);
            callback(articleErr);
        } else {
            // If orders are removed successfully, then remove the seller log
            cartDb.remove({buyer:buyerId}, callback);
            buyerDb.remove({_id : buyerId}, callback);
        }
    });
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