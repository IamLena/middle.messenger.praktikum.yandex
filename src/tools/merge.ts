// function merge(lhs: Indexed, rhs: Indexed): Indexed {
//   const result: Indexed = {};
//   const keysLhs = Object.keys(lhs);
//   const keysRhs = Object.keys(rhs);

//   keysLhs.forEach(key => {
//     if (keysRhs.includes(key)) {
//       if (typeof lhs[key] === 'object' &&
//         typeof rhs[key] === 'object') {
//         result[key] = merge(lhs[key] as Indexed, rhs[key] as Indexed);
//       } else {
//         result[key] = rhs[key];
//       }
//     } else {
//       result[key] = lhs[key];
//     }
//   });

//   keysRhs.forEach(key => {
//     if (!keysLhs.includes(key)) {
//       result[key] = rhs[key];
//     }
//   })

//   return result;
// }

type Indexed = Record<string, unknown>;

function isPlainObject(value: unknown): value is Indexed {
	return (
		typeof value === 'object' &&
		value !== null &&
		value.constructor === Object
	);
}

export function merge(lhs: Indexed = {}, rhs: Indexed = {}): Indexed {
	Object.keys(rhs).forEach((key) => {
		const rightValue = rhs[key];

		if (Array.isArray(rightValue)) {
			lhs[key] = rightValue.slice();
			return;
		}

		if (isPlainObject(rightValue)) {
			const leftValue = isPlainObject(lhs[key])
				? (lhs[key] as Indexed)
				: {};
			lhs[key] = merge(leftValue, rightValue);
			return;
		}

		lhs[key] = rightValue as Indexed;
	});

	return lhs;
}
