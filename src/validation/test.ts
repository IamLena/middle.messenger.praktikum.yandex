import {
    loginValidation,
    passwordValidation,
    nameValidation,
    emailValidation,
    phoneValidation,
    messageValidation,
} from './index.ts';

function test(testName: string, result: string, expected: string) {
    console.log(`${testName}: ${result === expected ? 'OK' : 'FAIL'}`)
}

// login — от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них,
// без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание).
console.log('--------LOGIN---------');
test('пустая строка', loginValidation(''), null);
test('меньше трех символов', loginValidation('ab'), null);
test('больше 20 символов', loginValidation('zaqwsxcderfvbgtyhnmjuik,'), null);
test('не латиница', loginValidation('ололоцуке'), null);
test('состоит только из цифр', loginValidation('134567'), null);
test('содержит пробел', loginValidation('jsfd kfjdl'), null);
test('содержит спецсимвол', loginValidation('hgh^jjh'), null);

test('три символа', loginValidation('abc'), 'abc');
test('20 символов', loginValidation('zaqwsxcderfvbgtyhnm'), 'zaqwsxcderfvbgtyhnm');
test('содержит цифру', loginValidation('zaq1wsx'), 'zaq1wsx');
test('содержит дефис', loginValidation('zaqwsx-cde'), 'zaqwsx-cde');
test('содержит нижнее подчеркивание', loginValidation('zaqwsx_cde'), 'zaqwsx_cde');

// password - от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра.
console.log('--------PASSWORD---------');
test('пустая строка', passwordValidation(''), null);
test('меньше 8 символов', passwordValidation(''), null);
test('больше 40 символов', passwordValidation(''), null);
test('нет заглавной буквы', passwordValidation(''), null);
test('нет цифры', passwordValidation(''), null);

test('8 символов', passwordValidation(''), null);
test('40 символов', passwordValidation(''), null);
test('есть заглавная буква и цифра', passwordValidation(''), null);


// first_name, second_name — латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов (допустим только дефис).
console.log('--------FIRST/SECOND NAME---------');
test('пустая строка', nameValidation(''), '');
test('первая буква не заглавная', nameValidation(''), '');
test('содержит цифру', nameValidation(''), '');
test('сожержит пробел', nameValidation(''), '');
test('содержит спецсимвол', nameValidation(''), '');
test('состоит из латиницы и кирилицы сразу', nameValidation(''), '');

test('содержит дефис', nameValidation(''), '');
test('состоит из кирилицы', nameValidation(''), '');
test('состоит из латиницы', nameValidation(''), '');

// email — латиница, может включать цифры и спецсимволы вроде дефиса и подчёркивания, обязательно должна быть «собака» (@) и точка после неё, но перед точкой обязательно должны быть буквы.
console.log('--------EMAIL---------');
test('', emailValidation(''), '');

// phone — от 10 до 15 символов, состоит из цифр, может начинается с плюса.
console.log('--------PHONE---------');
test('пустая строка', phoneValidation(''), '');
test('меньше 10 символов', phoneValidation(''), '');
test('больше 15 символов', phoneValidation(''), '');
test('содержит символ отличный от плюса или цифры', phoneValidation(''), '');
test('начинается с двух плючов', phoneValidation(''), '');

test('начинается с одного плюса', phoneValidation(''), '');
test('содержит только цифры', phoneValidation(''), '');
test('10 символов', phoneValidation(''), '');
test('15 символов', phoneValidation(''), '');

//message — не должно быть пустым.
console.log('--------MESSAGE---------');
test('пустая строка', messageValidation(''), '');
test('не пустая строка', messageValidation(''), '');

