import { merge } from './merge';

type Indexed<T = unknown> = {
	[key in string]: T;
};

// пример
// set({ foo: 5 }, 'bar.baz', 10); // { foo: 5, bar: { baz: 10 } }
// set(3, 'foo.bar', 'baz'); // 3
export function set(
	object: Indexed | unknown,
	path: string,
	value: unknown
): Indexed | unknown {
	if (typeof object !== 'object' || object === null) {
		return object;
	}

	if (typeof path !== 'string') {
		throw new Error('path must be string');
	}

	const keys = path.split('.').reverse();
	keys.forEach((key) => {
		const result = {
			[key]: value,
		};
		value = result;
	});
	object = merge(object as Indexed, value as Indexed);
	return object;
}
