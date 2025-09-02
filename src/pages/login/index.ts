import Handlebars from "handlebars";
import pageTemplate from './page.tmpl.ts';
import formPartial from '../../components/form.tmpl.ts';
import buttonPartial from '../../components/button.tmpl.ts';
import inputPartial from '../../components/input.tmpl.ts';
import linkPartial from '../../components/link.tmpl.ts';
import commonCss from '../../styles/layout.module.css'

Handlebars.registerPartial('button', buttonPartial);
Handlebars.registerPartial('link', linkPartial);
Handlebars.registerPartial('input', inputPartial);
Handlebars.registerPartial('form', formPartial);

const loginPageData = {
    formData: {
        formHeader: 'Please sign in',
        inputDatas: [{
            id: 'login',
            label: 'login:',
            type: 'text',
            name: 'login',
        }, {
            id: 'password',
            label: 'password:',
            type: 'password',
            name: 'password',
        }],
        text: 'Sign in',
    },
    lintData: {
        url: '/pages/register/index.html',
        text: 'Register'
    },
    text: "Don't have an account?",
    className: commonCss.main,
    containerClassName: commonCss.container,
};

const template = Handlebars.compile(pageTemplate);
const appElement = document.querySelector('#app');
if (appElement) {
    appElement.innerHTML = template(loginPageData);
}
