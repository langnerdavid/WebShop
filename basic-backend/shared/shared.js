import validator from 'validator';
import germanZipCodes  from 'german-zip-codes';
import {listOneArticle} from "../services/article.js";

export function isPasswordSecure(password) {
    // Überprüfe, ob das Passwort mindestens 8 Zeichen lang ist
    if (!validator.isLength(password, { min: 8 })) {
        return false;
    }

    // Überprüfe, ob das Passwort Großbuchstaben, Kleinbuchstaben, Sonderzeichen und Zahlen enthält
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    // Überprüfe, ob alle Kriterien erfüllt sind
    return hasUpperCase && hasLowerCase && hasSpecialChar && hasNumber;
}

export function validateZipCode(zipCode, city){
    const districts = germanZipCodes.getDistrictsByZipCode(zipCode);
    return [!(districts.length === 0 || districts.length > 1 || districts[0].toLowerCase() !== city.toLowerCase() || zipCode/10000 < 1), districts[0]];
}

export function validateUserInputs(user) {
    if (isPasswordSecure(user.password)) {
        if (validator.isEmail(user.email)) {
            const validateZips = validateZipCode(user.zipCode, user.city);
            if (validateZips[0]) {
                user.city = validateZips[1];
                return { isValid: true, message: "Validation successful!" };
            } else {
                return { isValid: false, message: "The given Zip-Code doesn't exist or is not in the given city" };
            }
        } else {
            return { isValid: false, message: "Invalid Email" };
        }
    } else {
        return { isValid: false, message: "Password is not secure" };
    }
}

// validationUtils.js
export function validateUserPatch(user, res) {
    let hasError = false;

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

    return { hasError, validateZips };
}

export async function calculateTotalAmount(order) {
    let totalAmount = 0;

    for (let i = 0; i < order?.articles.length; i++) {
        const article = await listOneArticle(order.articles[i].productId);
        if (article?.price) {
            totalAmount += article.price * order.articles[i].quantity;
        } else {
            return { error: `Product with productId: ${order.articles[i].productId} does not exist` };
        }
    }
    totalAmount = Number(totalAmount.toFixed(2));
    return totalAmount;
}

export async function isOneSeller(order){
    const firstArticle = await listOneArticle(order.articles[0].productId);
    const commonSeller = firstArticle?.seller;

    if (!commonSeller) {
        return { error: `Product with productId: ${order.articles[0].productId} does not exist or has no seller` };
    }

    for (let i = 1; i < order.articles.length; i++) {
        const article = await listOneArticle(order.articles[i].productId);

        if (!article?.seller) {
            return { error: `Product with productId: ${order.articles[i].productId} does not exist or has no seller` };
        }

        if (article.seller !== commonSeller) {
            return { error: `One Order may only be with Articles from one Seller` };
        }
    }

    return { isOneSeller: true, seller: commonSeller };
}