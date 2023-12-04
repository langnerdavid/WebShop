import { articleDb } from "./databases.js";


export function createArticleLog(articleReq){
    const currentTimestamp = new Date().toISOString();
    const article = {
        title: articleReq.title,
        description: articleReq.description,
        price: articleReq.price,
        stockQuantity: articleReq.stockQuantity,
        available: articleReq.available,
        brand: articleReq.brand,
        seller: articleReq.seller,
        searchingKeywords: articleReq.searchingKeywords,

        createdAt: currentTimestamp,
        updatedAt: currentTimestamp
    };
    return articleDb.insertAsync(article);
}

export function updateArticleLog(articleReq, articleId) {
    return new Promise((resolve, reject) => {
        const currentTimestamp = new Date().toISOString();

        listOneArticleLog(articleId, (err, article) => {
            const oldArticle = article[0];
            if (err) {
                console.error(err);
                reject(err);
            } else {
                const article = {
                    title: articleReq?.title ?? oldArticle.title,
                    description: articleReq?.description ?? oldArticle.description,
                    price: articleReq?.price ?? oldArticle.price,
                    stockQuantity: articleReq?.stockQuantity ?? oldArticle.stockQuantity,
                    available: articleReq?.available ?? oldArticle.available,
                    brand: articleReq?.brand ?? oldArticle.brand,
                    seller: oldArticle.seller,
                    searchingKeywords: articleReq?.searchingKeywords ?? oldArticle.searchingKeywords,

                    createdAt: oldArticle.createdAt,
                    updatedAt: currentTimestamp,
                };
                console.log(article);

                articleDb.update({ _id: articleId }, { $set: article }, {}, (err, numReplaced) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve(article);
                    }
                });
            }});
        });
}


export function listArticlesLog(callback) {
    articleDb.find({}, callback);
}

export function listOneArticleLog(articleId, callback) {
    articleDb.find({_id : articleId}, callback);
}

export function deleteOneArticleLog(articleId, callback) {
    articleDb.remove({_id : articleId}, callback);
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