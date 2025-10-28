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
): boolean {
	if (lhs === rhs) {
		return true;
	}

	if (isArray(lhs) && isArray(rhs)) {
		if (lhs.length !== rhs.length) {
			return false;
		}
		for (let index = 0; index < lhs.length; index += 1) {
			const leftValue = lhs[index];
			const rightValue = rhs[index];
			if (isArrayOrObject(leftValue) && isArrayOrObject(rightValue)) {
				if (
					!isEqual(
						leftValue as PlainObject | ArrayType,
						rightValue as PlainObject | ArrayType
					)
				) {
					return false;
				}
			} else if (leftValue !== rightValue) {
				return false;
			}
		}
		return true;
	}

	if (isPlainObject(lhs) && isPlainObject(rhs)) {
		const lhsKeys = Object.keys(lhs);
		const rhsKeys = Object.keys(rhs);
		if (lhsKeys.length !== rhsKeys.length) {
			return false;
		}
		return lhsKeys.every((key) => {
			const leftValue = lhs[key];
			const rightValue = rhs[key];
			if (isArrayOrObject(leftValue) && isArrayOrObject(rightValue)) {
				return isEqual(
					leftValue as PlainObject | ArrayType,
					rightValue as PlainObject | ArrayType
				);
			}
			return leftValue === rightValue;
		});
	}

	return false;
}
