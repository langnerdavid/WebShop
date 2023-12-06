import express from 'express';
import validator from 'validator';
import {
    createSeller,
    deleteOneSeller,
    listOneSeller,
    listSellers,
    updateSeller
} from "../services/seller.js";
import { isPasswordSecure } from "../shared/shared.js";
import {listOneSellerLog} from "../models/seller.js";

const router = express.Router();
router.post('/', validateSeller, async (req, res) => {
    const user = req.body.user;
    try {
        //If loop is needed if there is a unique attribute of the seller, which can be set with the post request
        /*const existingSeller = await listOneSellerByUsername(user.username);
        if (existingSeller.length !== 0) {
            res.status(400).json('Username is already taken');
        } else { */
            try {
                const data = await createSeller(user);
                res.json(data);
            } catch (e) {
                console.error(e);
                res.send(500);
            }
        //}
    }catch (e) {
        console.error(e);
        res.send(500);
    }
});

router.get('/', async (req, res) => {
    try {
        const data = await listSellers();
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

router.get('/:Id', async (req, res) => {
    const sellerId = req.params.Id;
    try {
        const data = await listOneSeller(sellerId);
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

router.patch('/:Id',authorizeSeller, async (req, res) => {
    const sellerId = req.params.Id;
    const user = req.body.user;

    try {
        const data = await updateSeller(user, sellerId);
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

router.delete('/:Id', authorizeSeller, async (req, res) => {
    const sellerId = req.params.Id;
    try {
        const data = await deleteOneSeller(sellerId);
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

function validateSeller(req, res, next) {
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

async function authorizeSeller(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Authorization Header missing.');
    }
    const b64auth = authHeader.split(' ')[1];
    let [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    const [user] = await listOneSeller(req.params.Id);
    if(username === user?.username){
        if(password === user?.password){
            console.log('authorized')
            next();
        }else{
            res.status(401).send('Wrong Password');
        }
    }else{
        res.status(404).send('Wrong username');
    }

}

export { router as sellerController };
