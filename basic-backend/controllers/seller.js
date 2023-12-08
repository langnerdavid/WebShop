import express from 'express';
import validator from 'validator';
import {
    createSeller,
    deleteOneSeller,
    listOneSeller,
    listSellers,
    updateSeller
} from "../services/seller.js";
import {isPasswordSecure, validateZipCode} from "../shared/shared.js";
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
    if (user.brand && user.address && user.email && user.password && user.zipCode && user.city) {
        if(isPasswordSecure(user.password)){
            if(validator.isEmail(user.email)){
                const validateZips = validateZipCode(user.zipCode,user.city);
                if(validateZips[0]) {
                    user.city = validateZips[1];
                    next();
                }else{
                    res.status(403).send('The given Zip-Code doesnt exist or is not in the given city');
                }
            }else{
                res.status(403).send('Invalid Email')
            }
        }else{
            res.status(403).send('Password is not secure')
        }
    } else {
        res.status(400).send('User Data incomplete');
    }
}


function validateSellerPatch(req, res, next) {
    const user = req.body.user;
    let hasError = false;

    if (!user.password && !user.brand && !user.address && !user.email && !user.city && !user.zipCode) {
        res.status(403).send('Error: At least one of the attributes (password, brand, address, email, city, zipCode) must exist.');
        hasError = true;
    }

    if (user.password && !isPasswordSecure(user.password)) {
        res.status(403).send('Password is not secure');
        hasError = true;
    }

    if (user.email && !validator.isEmail(user.email)) {
        res.status(403).send('Invalid Email');
        hasError = true;
    }

    const validateZips = validateZipCode(user.zipCode, user.city);
    if (user.address && user.zipCode && user.city && !validateZips[0]) {
        res.status(403).send('The given Zip-Code doesn\'t exist or is not in the given city');
        hasError = true;
    }

    if (!hasError) {
        user.city = validateZips[1];
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
