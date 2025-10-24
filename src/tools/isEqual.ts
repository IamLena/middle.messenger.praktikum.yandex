type PlainObject<T = unknown> = {
	[k in string]: T;
};

type ArrayType = Array<unknown>;

function isPlainObject(value: unknown): value is PlainObject {
	return (
		typeof value === 'object' &&
		value !== null &&
		value.constructor === Object &&
		Object.prototype.toString.call(value) === '[object Object]'
	);
}

function isArray(value: unknown): value is ArrayType {
	return Array.isArray(value);
}

function isArrayOrObject(value: unknown): value is ArrayType | PlainObject {
	return isPlainObject(value) || isArray(value);
}

export function isEqual(
	lhs: PlainObject | ArrayType,
	rhs: PlainObject | ArrayType
) {
	if (!lhs || !rhs || Object.keys(lhs).length !== Object.keys(rhs).length) {
		return false;
	}

	for (const [key, value] of Object.entries(lhs)) {
		const rightValue = rhs[key];
		if (isArrayOrObject(value) && isArrayOrObject(rightValue)) {
			if (isEqual(value, rightValue)) {
				continue;
			}
			return false;
		}

		if (value !== rightValue) {
			return false;
		}
	}

	return true;
}
