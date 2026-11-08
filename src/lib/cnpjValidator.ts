export function isValidCnpj(cnpj: string):boolean{

    const cleanCnpj = cnpj.replace(/\D/g,'');

    if(cleanCnpj.length !== 14){

        return false
    };

    if(/^(\d)\1{13}$/.test(cleanCnpj)){

        return false
    };

    let length = cleanCnpj.length -2;
    let number = cleanCnpj.substring(0, length);
    const digits = cleanCnpj.substring(length);
    let sum = 0;
    let multiplier = length - 7;

    for (let i = length; i >= 1; i--) {
        sum += parseInt(number.charAt(length - i)) * multiplier--;
        if (multiplier < 2) multiplier = 9;
    };

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (result !== parseInt(digits.charAt(0))) {
        return false;
    };

    length = length + 1;
    number = cleanCnpj.substring(0, length);
    sum = 0;
    multiplier = length - 7;

    for (let i = length; i >= 1; i--) {
        sum += parseInt(number.charAt(length - i)) * multiplier--;
        if (multiplier < 2) multiplier = 9;
    };

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) {
        return false;
    };

    return true;
}