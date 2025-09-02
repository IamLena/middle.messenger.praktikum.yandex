import Handlebars from "handlebars";
import pageTemplate from './page.tmpl.ts';
import inputPartial from '../../components/input.tmpl.ts';
import textPartial from '../../components/text.tmpl.ts';

Handlebars.registerPartial('input', inputPartial);
Handlebars.registerPartial('text', textPartial);

const chatsPageData = {
    inputData: {
        id: 'message',
        label: 'message',
        type: 'text',
        name: 'message',
    },
    text: "your chats will be here soon",
};

const template = Handlebars.compile(pageTemplate);
const appElement = document.querySelector('#app');
appElement.innerHTML = template(chatsPageData);
