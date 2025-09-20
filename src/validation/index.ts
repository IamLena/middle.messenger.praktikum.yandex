export type ValidationResult = {
	value: string;
	isValid: boolean;
	error?: string;
};
export type ValidationFunction = (value: string) => ValidationResult;

export const loginValidation: ValidationFunction = (value) => {
	const isValid = /^(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,20}$/.test(value);
	return {
		value,
		isValid,
		error: isValid
			? undefined
			: 'Ваш логин должен быть от 3 до 20 символов, состоять из латиницы, может содержать цифры, но не состоять из них, без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание)',
	};
};

export const passwordValidation: ValidationFunction = (value) => {
	const isValid = /^(?=.*[A-Z])(?=.*\d).{8,40}$/.test(value);
	return {
		value,
		isValid,
		error: isValid
			? undefined
			: 'Ваш пароль должен быть 8 до 40 символов, обязательно иметь хотя бы одну заглавную букву и цифру',
	};
};

export const nameValidation: ValidationFunction = (value) => {
	const isValid =
		/^[A-Z][a-z-]*$/.test(value) || /^[А-ЯЁ][а-яё-]*$/.test(value);
	return {
		value,
		isValid,
		error: isValid
			? undefined
			: 'Имя должно быть на латинице или кириллице, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов (допустим только дефис)',
	};
};

export const displayNameValidation: ValidationFunction = (value) => {
	const isValid = Boolean(value);
	return {
		value,
		isValid,
		error: isValid ? undefined : 'Это поле не может быть пустым',
	};
};

export const emailValidation: ValidationFunction = (value) => {
	const isValid =
		/^[0-9a-zA-Z.!#$%&’*+/=?^_{|}~-]+@[a-zA-Z]+\.[0-9a-zA-Z\-_]+$/.test(
			value
		);
	return {
		value,
		isValid,
		error: isValid
			? undefined
			: 'Ваш адрес электронной почты должен состоять из латиницы, может включать цифры и спецсимволы вроде дефиса и подчёркивания, обязательно должна быть «собака» (@) и точка после неё, но перед точкой обязательно должны быть буквы',
	};
};

export const phoneValidation: ValidationFunction = (value) => {
	const isValid = /^(?=.{10,15}$)\+?\d+$/.test(value);
	return {
		value,
		isValid,
		error: isValid
			? undefined
			: 'Телефон должен быть от 10 до 15 символов, состоит из цифр, может начинается с плюса',
	};
};

export const messageValidation: ValidationFunction = (value) => {
	const isValid = Boolean(value);
	return {
		value,
		isValid,
	};
};
