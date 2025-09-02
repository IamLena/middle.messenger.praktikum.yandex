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
        formHeader: 'Profile',
        inputDatas: [{
            id: 'avatar',
            label: 'upload avatar image',
            type: 'file',
            name: 'avatar',
        },{
            id: 'first_name',
            label: 'first name',
            type: 'text',
            name: 'first_name',
            value: 'my first name',
        }, {
            id: 'second_name',
            label: 'second name',
            type: 'text',
            name: 'second_name',
            value: 'my second name',
        },{
            id: 'email',
            label: 'email',
            type: 'email',
            name: 'email',
            value: 'my@email.com',
        },{
            id: 'phone',
            label: 'phone',
            type: 'phone',
            name: 'phone',
            value: '+7(777)777-77-77',
        },{
            id: 'login',
            label: 'login',
            type: 'text',
            name: 'login',
            value: 'login',
        },{
            id: 'oldPassword',
            label: 'old password',
            type: 'password',
            name: 'oldPassword',
        },{
            id: 'newPassword',
            label: 'new password',
            type: 'password',
            name: 'newPassword',
        }],
        text: 'Save',
    },
};

const template = Handlebars.compile(pageTemplate);
const appElement = document.querySelector('#app');
if (appElement) {
    appElement.innerHTML = template(registerPageData);
}
