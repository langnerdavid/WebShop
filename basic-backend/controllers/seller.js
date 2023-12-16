import express from 'express';
import validator from 'validator';
import {
    createSeller,
    deleteOneSeller,
    listOneSeller,
    listSellers,
    updateSeller
} from "../services/seller.js";
import {isPasswordSecure, validateUserInputs, validateUserPatch, validateZipCode} from "../shared/shared.js";
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
        if(data.length === 0){
            res.status(404).send('Seller doesn\'t exist');
        }else {
            res.json(data[0]);
        }
    } catch (e) {
        console.error(e);
        res.send(500);
    }
});

router.patch('/:Id',authorizeSeller, validateSellerPatch, async (req, res) => {
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
    if (user.brand && user.address && user.email && user.password && user.zipCode && user.city && user.iban) {
        //validateUserInputs makes sure, that the given Attributes are correct
        const validationResult = validateUserInputs(user);
        if(validationResult.isValid){
            next();
        }else{
            res.status(403).send(validationResult.message)
        }
    } else {
        res.status(400).send('User Data incomplete');
    }
}


function validateSellerPatch(req, res, next) {
    const user = req.body.user;
    let hasError = false;

    if (!user.password && !user.brand && !user.address && !user.email && !user.city && !user.zipCode && !user.iban) {
        res.status(403).send('Error: At least one of the attributes (password, brand, address, email, city, zipCode) must exist.');
        hasError = true;
    }


    // validationUserParch validates, that the patched Attributes are correct
    const validationResult = validateUserPatch(user, res);

    if (!validationResult.hasError) {
        user.city = validationResult.validateZips[1];
        next();
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
    if(username === user?._id){
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
