import Handlebars from "handlebars";
import pageTemplate from './page.tmpl.ts';
import textPartial from '../../components/text.tmpl.ts';
import commonCss from '../../styles/layout.module.css'

Handlebars.registerPartial('text', textPartial);

const chatsPageData = {
    text: "internal error",
    className: commonCss.errorMessage,
};

const template = Handlebars.compile(pageTemplate);
const appElement = document.querySelector('#app');
if (appElement) {
    appElement.innerHTML = template(chatsPageData);
}
