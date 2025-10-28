/**
 * На входе: объект. Пример: {a: 1, b: 2, c: {d: 123}, k: [1, 2, 3]}
 * На выходе: строка. Пример: ?a=1&b=2&c=[object Object]&k=1,2,3
 */
export function queryStringify(data: Record<string, unknown>): string {
	// Можно делать трансформацию GET-параметров в отдельной функции
	if (typeof data === 'object') {
		const keys = Object.keys(data);
		if (keys.length !== 0) {
			let result = '';
			keys.forEach(
				(key, index) =>
					(result += `${index === 0 ? '?' : '&'}${key}=${data[key]}`)
			);
			return result;
		}
	}
	return '';
}
