// login — от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них,
// без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание).

export function loginValidation(value: string) {
    console.log('loginValidation', value);
    if (!value) { return null }
    if (value.length < 3 || value.length > 20) { return null }
    if (/[\s\W]/.test(value.replace(/[-_]/g, ''))) { return null }
    if (/^\d+$/.test(value)) { return null };
    
    return value;
};

// password - от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра.
export function passwordValidation(value: string) {
    console.log('passwordValidation', value);
    if (!value) { return null }
    if (value.length < 8 || value.length > 40) { return null }
    
    return value;
}

// first_name, second_name — латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов (допустим только дефис).
export function nameValidation(value: string) {
    console.log('nameValidation', value);
    if (!value) { return null }
    
    return value;
}

// email — латиница, может включать цифры и спецсимволы вроде дефиса и подчёркивания, обязательно должна быть «собака» (@) и точка после неё, но перед точкой обязательно должны быть буквы.
export function emailValidation(value: string) {
    console.log('emailValidation', value);
    if (!value) { return null }
    
    return value;
}

// phone — от 10 до 15 символов, состоит из цифр, может начинается с плюса.
export function phoneValidation(value: string) {
    console.log('phoneValidation', value);
    if (!value) { return null }
    if (value.length < 10 || value.length > 15) { return null }
    return value;
}

//message — не должно быть пустым.
export function messageValidation(value: string) {
    console.log('messageValidation', value);
    if (!value) { return null }
    return value;
}
