import { buyerDb } from "./databases.js";


export function createBuyerLog(user){
    const currentTimestamp = new Date().toISOString();
    const buyer = {
        username: user.username,
        password: user.password,

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
                    username: user.username || oldUser.username,
                    password: user.password || oldUser.password,
                    createdAt: oldUser.createdAt,
                    updatedAt: currentTimestamp,
                };

                buyerDb.update({ _id: buyerId }, { $set: buyer }, {}, (err, numReplaced) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve(buyer);
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

export function deleteOneBuyerLog(buyerId, callback) {
    buyerDb.remove({_id : buyerId}, callback);
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