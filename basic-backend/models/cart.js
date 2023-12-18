import {cartDb} from './databases.js'
export function createCartLog(cartReq){
    const currentTimestamp = new Date().toISOString();
    const cart = {
        articles: cartReq.articles,
        buyer: cartReq.buyer,
        totalAmount: cartReq.totalAmount,

        createdAt: currentTimestamp,
        updatedAt: currentTimestamp
    };
    return cartDb.insertAsync(cart);
}

export function updateCartLog(cartReq, buyerId) {
    return new Promise((resolve, reject) => {
        const currentTimestamp = new Date().toISOString();

        listOneCartLog(buyerId, (err, oldCart) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                const cart = {
                    articles: cartReq?.articles ?? oldCart.articles,
                    buyer: oldCart.buyer,
                    totalAmount: cartReq?.totalAmount ?? oldCart.totalAmount,

                    createdAt: oldCart.createdAt,
                    updatedAt: currentTimestamp
                };

                cartDb.update({ buyer: buyerId }, { $set: cart }, {}, (err, numReplaced) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve(cart);
                    }
                });
            }});
        });
}


export function listCartLog(callback) {
    cartDb.find({}, callback);
}

export function listOneCartLog(buyerId, callback) {
    cartDb.find({buyer : buyerId}, callback);
}

export function deleteOneCartLog(cartId, callback) {
    cartDb.remove({_id : cartId}, callback);
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