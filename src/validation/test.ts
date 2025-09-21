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
	result: {
		value: string;
		isValid: boolean;
		error?: string;
	},
	expected: string | null
) {
	console.log(
		`${testName}: ${result.isValid === Boolean(expected) ? 'OK' : 'FAIL'}`
	);
}

// first_name, second_name — латиница или кириллица, первая буква должна быть заглавной,
// без пробелов и без цифр, нет спецсимволов (допустим только дефис).
// ==================== NAME VALIDATION (first_name, second_name) ====================
console.log('--------NAME VALIDATION---------');
test('валидное имя кириллицей', nameValidation('Иван'), 'Иван');
test('валидное имя латиницей', nameValidation('John'), 'John');
test('имя с дефисом', nameValidation('Анна-мария'), 'Анна-мария');
test('первая буква не заглавная', nameValidation('иван'), null);
test('содержит цифры', nameValidation('Иван123'), null);
test('содержит пробелы', nameValidation('Иван Иванов'), null);
test('содержит спецсимволы', nameValidation('Иван!'), null);
test('пустая строка', nameValidation(''), null);

// login — от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них,
// без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание).
// ==================== LOGIN VALIDATION ====================
console.log('--------LOGIN VALIDATION---------');
test('валидный логин', loginValidation('user123'), 'user123');
test('логин с подчеркиванием', loginValidation('user_name'), 'user_name');
test('логин с дефисом', loginValidation('user-name'), 'user-name');
test('слишком короткий логин', loginValidation('ab'), null);
test('слишком длинный логин', loginValidation('a'.repeat(21)), null);
test('только цифры', loginValidation('123456'), null);
test('содержит пробелы', loginValidation('user name'), null);
test('кириллические символы', loginValidation('пользователь'), null);
test('недопустимые спецсимволы', loginValidation('user@name'), null);
test('пустая строка', loginValidation(''), null);

// email — латиница, может включать цифры и спецсимволы вроде дефиса и подчёркивания,
// обязательно должна быть «собака» (@) и точка после неё, но перед точкой обязательно должны быть буквы.
// ==================== EMAIL VALIDATION ====================
console.log('--------EMAIL VALIDATION---------');
test('валидный email', emailValidation('test@mail.ru'), 'test@mail.ru');
test('email с цифрами', emailValidation('test123@mail.ru'), 'test123@mail.ru');
test(
	'email с дефисом',
	emailValidation('test-name@mail.ru'),
	'test-name@mail.ru'
);
test(
	'email с подчеркиванием',
	emailValidation('test_name@mail.ru'),
	'test_name@mail.ru'
);
test('отсутствует @', emailValidation('mail.ru'), null);
test('отсутствует точка после @', emailValidation('test@mail'), null);
test('точка сразу после @', emailValidation('test@.mail.ru'), null);
test('спецсимволы кроме - и _', emailValidation('test@mail!.ru'), null);
test('кириллические символы', emailValidation('тест@mail.ru'), null);
test('пустая строка', emailValidation(''), null);

// password - от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра.
// ==================== PASSWORD VALIDATION ====================
console.log('--------PASSWORD VALIDATION---------');
test('валидный пароль', passwordValidation('Password123'), 'Password123');
test('пароль с минимальной длиной', passwordValidation('Pass1234'), 'Pass1234');
test(
	'пароль с максимальной длиной',
	passwordValidation('A'.repeat(39) + '1'),
	'A'.repeat(39) + '1'
);
test('слишком короткий пароль', passwordValidation('Pass123'), null);
test('слишком длинный пароль', passwordValidation('A'.repeat(41)), null);
test('без заглавных букв', passwordValidation('password123'), null);
test('без цифр', passwordValidation('Password'), null);
test('пустая строка', passwordValidation(''), null);

// phone — от 10 до 15 символов, состоит из цифр, может начинается с плюса.
// ==================== PHONE VALIDATION ====================
console.log('--------PHONE VALIDATION---------');
test('валидный телефон без плюса', phoneValidation('1234567890'), '1234567890');
test(
	'валидный телефон с плюсом',
	phoneValidation('+1234567890'),
	'+1234567890'
);
test('минимальная длина', phoneValidation('123456789'), null);
test('максимальная длина', phoneValidation('1234567890123456'), null);
test('содержит нецифровые символы', phoneValidation('123-456-7890'), null);
test('пустая строка', phoneValidation(''), null);

// ==================== MESSAGE VALIDATION ====================
console.log('--------MESSAGE VALIDATION---------');
test('непустое сообщение', messageValidation('Hello'), 'Hello');
test('сообщение с пробелами', messageValidation('Hello world'), 'Hello world');
test('пустая строка', messageValidation(''), null);
