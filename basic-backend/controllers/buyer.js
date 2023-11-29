import express from 'express';
import validator from 'validator';
import { createBuyer, listBuyers, listOneBuyer, deleteOneBuyer, updateBuyer } from "../services/buyer.js";
import { isPasswordSecure } from "../shared/shared.js";

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
    const user = req.body.user;
    if (user.firstName && user.lastName && user.address) {
        if(isPasswordSecure(user.password)){
            if(user.username){
                if(validator.isEmail(user.email)){
                    console.log('ja')
                    next();
                }else{
                    res.status(403).send('Invalid Email')
                }
            }else{
                res.status(409).send('Username already taken')
            }
        }else{
            res.status(403).send('Password is not secure')
        }
    } else {
        res.status(400).send('User Data incomplete');
    }
}

export { router as buyerController };
