export function maskCnpj(cnpj: string): string{

    const cleanCnpj = cnpj.replace(/\D/g,'');

    const masknumber = cleanCnpj
        .replace(/^(\d{2})(\d)/, "$1.$2")                          
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")              
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3/$4") 
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, "$1.$2.$3/$4-$5"); 

    return masknumber;
}