import Handlebars from "handlebars";
import pageTemplate from './page.tmpl.ts';
import textPartial from '../../components/text.tmpl.ts';
import linkPartial from '../../components/link.tmpl.ts';
import commonCss from '../../styles/layout.module.css'

Handlebars.registerPartial('text', textPartial);
Handlebars.registerPartial('link', linkPartial);

const chatsPageData = {
    text: 'page is not found',
    linkData: {
        text: 'back to chats',
        url: '/pages/chats/index.html',
    },
    containerClassName: commonCss.errorContainer,
    className: commonCss.errorMessage,
};

const template = Handlebars.compile(pageTemplate);
const appElement = document.querySelector('#app');
if (appElement) {
    appElement.innerHTML = template(chatsPageData);
}
