// login — от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них,
// без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание).

export function loginValidation(value: string) {
    console.log('loginValidation', value);
    const isValid = /^(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,20}$/.test(value);
    return isValid ? value : null;
};

// password - от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра.
export function passwordValidation(value: string) {
    console.log('passwordValidation', value);
    const isValid = /^(?=.*[A-Z])(?=.*\d).{8,40}$/.test(value);
    return isValid ? value : null;
}

// first_name, second_name — латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов (допустим только дефис).
export function nameValidation(value: string) {
    console.log('nameValidation', value);
    const isValid = /^[A-Z][a-z-]*$/.test(value) || /^[А-ЯЁ][а-яё-]*$/.test(value);
    return isValid ? value : null;
}

// email — латиница, может включать цифры и спецсимволы вроде дефиса и подчёркивания, обязательно должна быть «собака» (@) и точка после неё, но перед точкой обязательно должны быть буквы.
export function emailValidation(value: string) {
    console.log('emailValidation', value);
    const isValid = /^[0-9a-zA-Z\-_]+@[a-zA-Z]+\.[0-9a-zA-Z\-_]+$/.test(value);
    return isValid ? value : null;
}

// phone — от 10 до 15 символов, состоит из цифр, может начинается с плюса.
export function phoneValidation(value: string) {
    console.log('phoneValidation', value);
    const isValid = /^(?=.{10,15}$)\+?\d+$/.test(value);
    return isValid ? value : null;
}

//message — не должно быть пустым.
export function messageValidation(value: string) {
    console.log('messageValidation', value);
    if (!value) { return null }
    return value;
}
