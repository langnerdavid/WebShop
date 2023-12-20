import express from 'express';
import validator from 'validator';
import {createArticle, deleteOneArticle, listOneArticle, listArticles, updateArticle} from "../services/article.js";
import { isPasswordSecure } from "../shared/shared.js";
import {listOneSeller} from "../services/seller.js";

const router = express.Router();

router.post('/', validateArticle, authorizeArticlePost, async (req, res) => {
    const article = req.body.article;

    try {
        const data = await createArticle(article);
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

router.get('/', async (req, res) => {
    try {
        const data = await listArticles();
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

router.get('/:Id', async (req, res) => {
    const articleId = req.params.Id;
    try {
        const data = await listOneArticle(articleId);
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

router.patch('/:Id',authorizeArticle, async (req, res) => {
    const articleId = req.params.Id;
    const article = req.body.article;

    try {
        const data = await updateArticle(article, articleId);
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

router.delete('/:Id', authorizeArticle, async (req, res) => {
    const articleId = req.params.Id;
    try {
        const data = await deleteOneArticle(articleId);
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

function validateArticle(req, res, next) {
    const article = req.body.article;
    if (article?.title && article?.description && article?.price && article?.stockQuantity !== undefined && (article?.visible === true || article.visible === false) && article?.brand && article?.searchingKeywords){
        next();
    }else{
        res.status(400).send('Article Data incomplete');
    }
}

async function authorizeArticle(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Authorization Header missing.');
    }
    const b64auth = authHeader.split(' ')[1];
    let [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    const [article] = await listOneArticle(req.params.Id);
    const sellerArticle = article?.seller;
    const seller = await listOneSeller(sellerArticle);
    if(username === seller?.username){
        if(password === seller?.password){
            console.log('authorized');
            next();
        }else{
            res.status(401).send('Wrong Password');
        }
    }else{
        res.status(404).send('Wrong username');
    }

}

async function authorizeArticlePost(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Authorization Header missing.');
    }
    const b64auth = authHeader.split(' ')[1];
    let [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    const seller = await listOneSeller(username);
    if(username === seller?._id){
        if(password === seller?.password){
            console.log('authorized');
            req.body.article.seller = seller._id;
            next();
        }else{
            res.status(401).send('Wrong Password');
        }
    }else{
        res.status(404).send('Wrong username');
    }

}

export { router as articleController };
