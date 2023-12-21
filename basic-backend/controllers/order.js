import express from 'express';
import {createOrder, listOneOrder, listOrders, updateOrder} from "../services/order.js";
import {listOneBuyer} from "../services/buyer.js";
import {listOneSeller} from "../services/seller.js";

const router = express.Router();

router.post('/', validateOrder, authorizeOrder, async (req, res) => {
    const order = req.body.order;

    try {
        const data = await createOrder(order);
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
        const data = await listOrders();
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});


router.get('/:Id', async (req, res) => {
    const orderId = req.params.Id;
    try {
        const data = await listOneOrder(orderId);
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

router.patch('/:Id', authorizeSeller, validateOrderPatch, async (req, res) => {
    const orderId = req.params.Id;
    try {
        const data = await updateOrder(req.body.order, orderId);
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

function validateOrder(req, res, next) {
    const order = req.body?.order;

    if (order && order.articles?.length > 0 && order.status) {
        const hasInvalidArticles = order.articles.some(article => !article.productId || !article.quantity);

        if (hasInvalidArticles) {
            return res.status(400).send('Articles in Order not in the given DataForm');
        }

        const validStatusValues = ["placed", "shipped", "delivered", "canceled"];

        if (validStatusValues.includes(order.status)) {
            return next();
        } else {
            return res.status(400).send('Order status is out of bounds');
        }
    } else {
        return res.status(400).send('Order Data incomplete');
    }
}


function validateOrderPatch(req, res, next) {
    const order = req.body?.order;
    console.log(req.body.order);
    if(order?.status==="placed"||order?.status==="shipped"||order?.status==="delivered"||order?.status==="canceled"){
        next();
    }else {
        res.status(400).send('Order status out of bounds');
    }
}


//username in AuthHeader is the Buyer_id!!
async function authorizeOrder(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Authorization Header missing.');
    }
    const b64auth = authHeader.split(' ')[1];
    let [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    const buyer = await listOneBuyer(username);
    if(username === buyer?._id){
        if(password === buyer?.password){
            req.body.order.buyer = buyer._id;
            next();
        }else{
            res.status(401).send('Wrong Password');
        }
    }else{
        res.status(404).send('Wrong username');
    }
}

async function authorizeSeller(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Authorization Header missing.');
    }
    const b64auth = authHeader.split(' ')[1];
    let [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    const seller = await listOneSeller(username);
    if(username === seller?._id){
        if(password === seller?.password){
            next();
        }else{
            res.status(401).send('Wrong Password');
        }
    }else{
        res.status(404).send('Wrong username');
    }
}

export { router as orderController };
