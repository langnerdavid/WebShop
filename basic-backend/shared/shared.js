import validator from 'validator';
import germanZipCodes  from 'german-zip-codes';

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