import express from 'express';
import { createBuyer, listBuyers, listOneBuyer, deleteOneBuyer, updateBuyer } from "../services/buyer.js";

const router = express.Router();


router.post('/', validateBuyer, async (req, res) => {
    const user = req.body.user;

    try {
        const data = await createBuyer(user);
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

router.get('/', async (req, res) => {
    try {
        const data = await listBuyers();
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

router.get('/:Id', async (req, res) => {
    const buyerId = req.params.Id;
    try {
        const data = await listOneBuyer(buyerId);
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

router.patch('/:Id',validateBuyer, async (req, res) => {
    const buyerId = req.params.Id;
    const user = req.body.user;

    try {
        const data = await updateBuyer(user, buyerId);
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

router.delete('/:Id', async (req, res) => {
    const buyerId = req.params.Id;
    try {
        const data = await deleteOneBuyer(buyerId);
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

function validateBuyer(req, res, next) {
    if (req.body.user.username && req.body.user.password) {
        next();
    } else {
        res.status(400);
        res.send('Body invalid');
    }
}

export { router as buyerController };
