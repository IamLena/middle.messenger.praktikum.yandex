import {
	loginValidation,
	passwordValidation,
	nameValidation,
	emailValidation,
	phoneValidation,
	messageValidation,
} from './index.ts';

function test(
	testName: string,
	result: string | null,
	expected: string | null
) {
	console.log(`${testName}: ${result === expected ? 'OK' : 'FAIL'}`);
}

// first_name, second_name — латиница или кириллица, первая буква должна быть заглавной,
// без пробелов и без цифр, нет спецсимволов (допустим только дефис).
// ==================== NAME VALIDATION (first_name, second_name) ====================
console.log('--------NAME VALIDATION---------');
test('валидное имя кириллицей', nameValidation('Иван', false), 'Иван');
test('валидное имя латиницей', nameValidation('John', false), 'John');
test('имя с дефисом', nameValidation('Анна-мария', false), 'Анна-мария');
test('первая буква не заглавная', nameValidation('иван', false), null);
test('содержит цифры', nameValidation('Иван123', false), null);
test('содержит пробелы', nameValidation('Иван Иванов', false), null);
test('содержит спецсимволы', nameValidation('Иван!', false), null);
test('пустая строка', nameValidation('', false), null);

// login — от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них,
// без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание).
// ==================== LOGIN VALIDATION ====================
console.log('--------LOGIN VALIDATION---------');
test('валидный логин', loginValidation('user123', false), 'user123');
test(
	'логин с подчеркиванием',
	loginValidation('user_name', false),
	'user_name'
);
test('логин с дефисом', loginValidation('user-name', false), 'user-name');
test('слишком короткий логин', loginValidation('ab', false), null);
test('слишком длинный логин', loginValidation('a'.repeat(21), false), null);
test('только цифры', loginValidation('123456', false), null);
test('содержит пробелы', loginValidation('user name', false), null);
test('кириллические символы', loginValidation('пользователь', false), null);
test('недопустимые спецсимволы', loginValidation('user@name', false), null);
test('пустая строка', loginValidation('', false), null);

// email — латиница, может включать цифры и спецсимволы вроде дефиса и подчёркивания,
// обязательно должна быть «собака» (@) и точка после неё, но перед точкой обязательно должны быть буквы.
// ==================== EMAIL VALIDATION ====================
console.log('--------EMAIL VALIDATION---------');
test('валидный email', emailValidation('test@mail.ru', false), 'test@mail.ru');
test(
	'email с цифрами',
	emailValidation('test123@mail.ru', false),
	'test123@mail.ru'
);
test(
	'email с дефисом',
	emailValidation('test-name@mail.ru', false),
	'test-name@mail.ru'
);
test(
	'email с подчеркиванием',
	emailValidation('test_name@mail.ru', false),
	'test_name@mail.ru'
);
test('отсутствует @', emailValidation('mail.ru', false), null);
test('отсутствует точка после @', emailValidation('test@mail', false), null);
test('точка сразу после @', emailValidation('test@.mail.ru', false), null);
test('спецсимволы кроме - и _', emailValidation('test@mail!.ru', false), null);
test('кириллические символы', emailValidation('тест@mail.ru', false), null);
test('пустая строка', emailValidation('', false), null);

// password - от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра.
// ==================== PASSWORD VALIDATION ====================
console.log('--------PASSWORD VALIDATION---------');
test(
	'валидный пароль',
	passwordValidation('Password123', false),
	'Password123'
);
test(
	'пароль с минимальной длиной',
	passwordValidation('Pass1234', false),
	'Pass1234'
);
test(
	'пароль с максимальной длиной',
	passwordValidation('A'.repeat(39) + '1', false),
	'A'.repeat(39) + '1'
);
test('слишком короткий пароль', passwordValidation('Pass123', false), null);
test('слишком длинный пароль', passwordValidation('A'.repeat(41), false), null);
test('без заглавных букв', passwordValidation('password123', false), null);
test('без цифр', passwordValidation('Password', false), null);
test('пустая строка', passwordValidation('', false), null);

// phone — от 10 до 15 символов, состоит из цифр, может начинается с плюса.
// ==================== PHONE VALIDATION ====================
console.log('--------PHONE VALIDATION---------');
test(
	'валидный телефон без плюса',
	phoneValidation('1234567890', false),
	'1234567890'
);
test(
	'валидный телефон с плюсом',
	phoneValidation('+1234567890', false),
	'+1234567890'
);
test('минимальная длина', phoneValidation('123456789', false), null);
test('максимальная длина', phoneValidation('1234567890123456', false), null);
test(
	'содержит нецифровые символы',
	phoneValidation('123-456-7890', false),
	null
);
test('пустая строка', phoneValidation('', false), null);

// ==================== MESSAGE VALIDATION ====================
console.log('--------MESSAGE VALIDATION---------');
test('непустое сообщение', messageValidation('Hello', false), 'Hello');
test(
	'сообщение с пробелами',
	messageValidation('Hello world', false),
	'Hello world'
);
test('пустая строка', messageValidation('', false), null);
