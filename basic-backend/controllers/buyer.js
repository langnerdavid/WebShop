import express from 'express';
import {
    createBuyer,
    listBuyers,
    listOneBuyer,
    deleteOneBuyer,
    updateBuyer,
    listOneBuyerByEmail
} from "../services/buyer.js";
import { validateUserInputs, validateUserPatch } from "../shared/shared.js";
import {listOneSellerByEmail} from "../services/seller.js";

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
router.post('/login', authorizeBuyerLogin, async (req, res) => {
    try {
        const data = await listOneBuyerByEmail(req.email);
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

router.patch('/:Id',authorizeBuyer, validateBuyerPatch, async (req, res) => {
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

router.delete('/:Id', authorizeBuyer, async (req, res) => {
    const buyerId = req.params.Id;
    try {
        const data = await deleteOneBuyer(buyerId);
        res.json(data);
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

async function validateBuyer(req, res, next) {
    const user = req.body.user;
    const checkUser = await listOneBuyerByEmail(user.email);
    if (checkUser !== undefined) {
        res.status(403).send('Account with this email already exists');
    }
    else if (user.firstName && user.lastName && user.address && user.email && user.password && user.zipCode && user.city && user.iban) {

        //validateUserInputs makes sure, that the given Attributes are correct
        const validationResult = validateUserInputs(user);
        if (validationResult.isValid) {
            next();
        } else {
            res.status(403).send(validationResult.message)
        }
    } else {
        res.status(400).send('User Data incomplete');
    }
}

function validateBuyerPatch(req, res, next) {
    const user = req.body.user;
    let hasError = false;

    if (!user.password && !user.firstName && !user.lastName && !user.address && !user.email && !user.city && !user.zipCode && !user.iban) {
        res.status(403).send('Error: At least one of the attributes (password, brand, address, email, city, zipCode) must exist.');
        hasError = true;
    }

    // validationUserParch validates, that the patched Attributes are correct
    const validationResult = validateUserPatch(user, res);

    if (!validationResult.hasError && !hasError) {
        user.city = validationResult.validateZips[1];
        next();
    }
}

async function authorizeBuyer(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Authorization Header missing.');
    }
    const b64auth = authHeader.split(' ')[1];
    let [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    const user = await listOneBuyer(req.params.Id);
    if(username === user?.username){
        if(password === user?.password){
            next();
        }else{
            res.status(401).send('Wrong Password');
        }
    }else{
        res.status(404).send('Wrong username');
    }

}

async function authorizeBuyerLogin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Authorization Header missing.');
    }
    const b64auth = authHeader.split(' ')[1];
    let [email, password] = Buffer.from(b64auth, 'base64').toString().split(':');
    const user = await listOneBuyerByEmail(email);
    if(user){
        if(password === user?.password){
            req.email = email;
            next();
        }else{
            res.status(401).send('Wrong Password');
        }
    }else{
        res.status(404).send('Wrong username');
    }

}

export { router as buyerController };
