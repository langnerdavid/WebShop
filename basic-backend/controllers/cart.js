import express from 'express';
import {createCart, deleteOneCart, listCarts, listOneCart, updateCart} from "../services/cart.js";
import {listOneBuyer} from "../services/buyer.js";

const router = express.Router();

router.post('/', validateCart, authorizeCart, async (req, res) => {
    const cart = req.body.cart;
    try {
        const data = await createCart(cart);
        if (data.error) {
            console.error(data.error);
            res.status(400).json({ error: data.error }); // Send an error response with the error message
        } else {
            res.json(data);
        }
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});

router.get('/', async (req, res) => {
    try {
        const data = await listCarts();
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});


router.get('/:Id', async (req, res) => {
    const buyerId = req.params.Id;
    try {
        const data = await listOneCart(buyerId);
        if(data===undefined){
            res.status(400).send('No Cart')
        }else{
            res.json(data);
        }
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

router.patch('/:Id',validateCart, authorizeCart, async (req, res) => {
    const buyerId = req.params.Id;
    const cart = req.body?.cart;

    try {
        const data = await updateCart(cart, buyerId);
        console.log(data);
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

router.delete('/:Id', authorizeCartDelete, async (req, res) => {
    const buyerId = req.params.Id;
    try {
        const data = await deleteOneCart(buyerId);
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

function validateCart(req, res, next) {
    const cart = req.body?.cart;
    let isValid = true;
    if (!cart || !cart.articles || cart.articles.length === 0) {
        isValid = false;
    }
    for(let i = 0; i<cart?.articles.length; i++){
        if(!cart.articles[i]?.productId || !cart.articles[i]?.quantity){
            isValid = false;
            break;
        }
    }
    if (isValid) {
        next();
    } else {
        res.status(400).send('Cart Data incomplete');
    }
}




//username in AuthHeader is the Buyer_id!!
async function authorizeCart(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Authorization Header missing.');
    }
    const b64auth = authHeader.split(' ')[1];
    let [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    const buyer = await listOneBuyer(username);
    if(username === buyer?._id){
        if(password === buyer?.password){
            req.body.cart.buyer = buyer._id;
            next();
        }else{
            res.status(401).send('Wrong Password');
        }
    }else{
        res.status(403).send('Wrong username');
    }

}

async function authorizeCartDelete(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Authorization Header missing.');
    }
    const b64auth = authHeader.split(' ')[1];
    let [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    const buyer = await listOneBuyer(username);
    if(username === buyer?._id){
        if(password === buyer?.password){
            next();
        }else{
            res.status(401).send('Wrong Password');
        }
    }else{
        res.status(404).send('Wrong username');
    }

}

export { router as cartController };
