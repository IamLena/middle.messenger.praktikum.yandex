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

type Indexed<T = unknown> = {
	[key in string]: T;
};

export function merge(lhs: Indexed, rhs: Indexed): Indexed {
	for (let p in rhs) {
		if (!rhs.hasOwnProperty(p)) {
			continue;
		}

		try {
			if (typeof rhs[p] === 'object') {
				rhs[p] = merge(lhs[p] as Indexed, rhs[p] as Indexed);
			} else {
				lhs[p] = rhs[p];
			}
		} catch (e) {
			lhs[p] = rhs[p];
		}
	}

	return lhs;
}
