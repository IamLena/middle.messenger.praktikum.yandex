import {
    LoginPage,
    // RegisterPage,
} from './pages';

import { Button } from './components/button';
import { Link } from './components/link';
import { Input } from './components/input';

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
                page = new Button({
                    text: 'helllo world!',
                    events: {
                        'click': () => {console.log('button click')}
                    },
                    class: 'my-button-class',
                    type: 'submit',
                })
                // page = LoginPage;
                // page = new LoginPage();
                break;
            case 'register':
                // page = new RegisterPage();
                page = new Link({
                    text: 'helllo world!',
                    url: 'https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener',
                    class: 'my-link-class',
                })
                break;
            case 'profile':
                // page = new RegisterPage();
                page = new Input({
                    id: 'input',
                    label: 'label',
                    type: 'text',
                    name: 'my-input',
                    class: 'my-input-class',
                })
                break;
        }

        if (page && this.rootElement) {
            page.dispatchComponentDidMount();
            this.rootElement.appendChild(page.getContent());
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
