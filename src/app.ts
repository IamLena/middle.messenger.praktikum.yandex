import { CurrentPage } from './components';

document.addEventListener('DOMContentLoaded', () => {
	const page = new CurrentPage();
	const rootElement = document.getElementById('app');
	if (rootElement) {
		rootElement.replaceWith(page.getContent());
	}
});
