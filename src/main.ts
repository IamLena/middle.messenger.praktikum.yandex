import {
    LoginPage,
    // RegisterPage,
} from './pages';

console.log('main.ts');

const pageIds = [
    'login',
    'register',
    'profile',
    'chats',
    'notFound',
    'fatal',
];

class Page {
    constructor() {
        this.rootElement = document.getElementById('main');
    }
    render(name: string) {
        console.log(`rendering ${name}`);
        let page = null;

        switch (name) {
            case 'login':
                page = LoginPage;
                // page = new LoginPage();
                break;
            case 'register':
                page = new RegisterPage();
                break;
        }

        if (page && this.rootElement) {
            this.rootElement.innerHTML = page;
            // this.rootElement.replaceWith(page.getContent());
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const page = new Page();

    pageIds.forEach(id => {
        document.getElementById(id)?.addEventListener('click', () => {
            page.render(id);
        });
    })
  
});
