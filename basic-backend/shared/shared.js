import validator from 'validator';

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