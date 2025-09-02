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

const registerPageData = {
    className: commonCss.main,
    containerClassName: commonCss.container,
    formData: {
        formHeader: 'Register',
        inputDatas: [{
            id: 'first_name',
            label: 'first name',
            type: 'text',
            name: 'first_name',
        }, {
            id: 'second_name',
            label: 'second name',
            type: 'text',
            name: 'second_name',
        },{
            id: 'email',
            label: 'email',
            type: 'email',
            name: 'email',
        },{
            id: 'phone',
            label: 'phone',
            type: 'phone',
            name: 'phone',
        },{
            id: 'login',
            label: 'login',
            type: 'text',
            name: 'login',
        },{
            id: 'password',
            label: 'password',
            type: 'password',
            name: 'password',
        }],
        text: 'Sign up',
    },
};

const template = Handlebars.compile(pageTemplate);
const appElement = document.querySelector('#app');
appElement.innerHTML = template(registerPageData);
