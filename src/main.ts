import { Page } from './components';

document.addEventListener("DOMContentLoaded", () => {
    const page = new Page({});
    const rootElement = document.getElementById('main');
    if (rootElement) {
        rootElement.replaceWith(page.getContent());
    }
});
