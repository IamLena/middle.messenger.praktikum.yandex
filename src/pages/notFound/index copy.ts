import Handlebars from "handlebars";
import pageTemplate from './page.tmpl.ts';
import formPartial from '../../components/form.tmpl.ts';
import buttonPartial from '../../components/button.tmpl.ts';
import inputPartial from '../../components/input.tmpl.ts';
import linkPartial from '../../components/link.tmpl.ts';
// import * as css from 'index.css';

Handlebars.registerPartial('button', buttonPartial);
Handlebars.registerPartial('link', linkPartial);
Handlebars.registerPartial('input', inputPartial);
Handlebars.registerPartial('form', formPartial);

const loginPageData = {
    formData: {
        formHeader: 'header',
        inputDatas: [{
            id: 'this.id',
            label: 'this.label',
            type: 'this.type',
            name: 'this.name',
            value: 'this.value',
        }],
        text: 'click me',
        // className: css.form,
    },
    lintData: {
        url: '/pages/register/index.html',
        text: 'register?'
    }
};

const template = Handlebars.compile(pageTemplate);
const appElement = document.querySelector('#app');
appElement.innerHTML = template(loginPageData);
