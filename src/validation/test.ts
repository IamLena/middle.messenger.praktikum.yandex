import {
    loginValidation,
    passwordValidation,
    nameValidation,
    emailValidation,
    phoneValidation,
    messageValidation,
} from './index.ts';

function test(testName: string, result: string | null, expected: string | null) {
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
test('меньше 8 символов', passwordValidation('abc'), null);
test('больше 40 символов', passwordValidation('oooooooooooooooooooooooooooooooooooooooo'), null);
test('нет заглавной буквы', passwordValidation('qwertyqwerty'), null);
test('нет цифры', passwordValidation('qwertyqwerty'), null);

test('8 символов', passwordValidation('12345A78'), '12345A78');
test('40 символов', passwordValidation('ooooooooooooooAooooooooooooooo1oooooooo'), 'ooooooooooooooAooooooooooooooo1oooooooo');
test('есть заглавная буква и цифра', passwordValidation('sdf1234WER5678fghj'), 'sdf1234WER5678fghj');


// first_name, second_name — латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов (допустим только дефис).
console.log('--------FIRST/SECOND NAME---------');
test('пустая строка', nameValidation(''), null);
test('первая буква не заглавная', nameValidation('bob'), null);
test('содержит цифру', nameValidation('Bob1'), null);
test('сожержит пробел', nameValidation('Bob bob'), null);
test('содержит спецсимвол', nameValidation('Bob!'), null);
test('состоит из латиницы и кирилицы сразу', nameValidation('Bobбоб'), null);

test('содержит дефис', nameValidation('Bob-bob'), 'Bob-bob');
test('состоит из кирилицы', nameValidation('Боб'), 'Боб');
test('состоит из латиницы', nameValidation('Bob'), 'Bob');

// email — латиница, может включать цифры и спецсимволы вроде дефиса и подчёркивания, обязательно должна быть «собака» (@) и точка после неё, но перед точкой обязательно должны быть буквы.
console.log('--------EMAIL---------');
test('пустая строка', emailValidation(''), null);

test('валидный', emailValidation('a@mail.ru'), 'a@mail.ru');

// phone — от 10 до 15 символов, состоит из цифр, может начинается с плюса.
console.log('--------PHONE---------');
test('пустая строка', phoneValidation(''), null);
test('меньше 10 символов', phoneValidation('123456789'), null);
test('больше 15 символов', phoneValidation('12345678901234567890'), null);
test('содержит символ отличный от плюса или цифры', phoneValidation('12345-678a90'), null);
test('начинается с двух плючов', phoneValidation('++1234567890'), null);

test('начинается с одного плюса', phoneValidation('+1234567890'), '+1234567890');
test('содержит только цифры', phoneValidation('123456789012'), '123456789012');
test('10 символов', phoneValidation('1234567890'), '1234567890');
test('15 символов', phoneValidation('123456789012345'), '123456789012345');

//message — не должно быть пустым.
console.log('--------MESSAGE---------');
test('пустая строка', messageValidation(''), null);
test('не пустая строка', messageValidation('text'), 'text');

