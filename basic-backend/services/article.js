import {
    createArticleLog,
    deleteOneArticleLog,
    listOneArticleLog,
    listArticlesLog,
    updateArticleLog
} from "../models/article.js";

export function createArticle(user) {
    return createArticleLog(user);
}

export function updateArticle(articleReq, articleId) {
    return new Promise((resolve, reject) => {
        updateArticleLog(articleReq, articleId).then((article) => {
                resolve(article);
        }).catch((err) =>{
            reject(err);
        });
    });
}

export function listArticles() {
    return new Promise((resolve, reject) => {
        listArticlesLog((err, documents) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(documents);
            }
        });
    });
}


export function listOneArticle(articleId) {
    return new Promise((resolve, reject) => {
        listOneArticleLog(articleId, (err, article) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(article[0]);
            }
        });
    });
}

export function deleteOneArticle(articleId) {
    return new Promise((resolve, reject) => {
        deleteOneArticleLog(articleId, (err, doc) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve('Erfolgreich deleted');
            }
        });
    });
}