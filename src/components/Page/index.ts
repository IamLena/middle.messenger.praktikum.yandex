import { Block } from "../../framework/Block";
import css from "./index.module.css";
import { Nav, Button } from "..";

export type PageProps = {
  class?: string;
};

const pageIds = ["login", "register", "profile", "chats", "notFound", "fatal"];

export class Page extends Block {
  currentPage: string = "login";

  constructor(props: PageProps) {
    super({
      class: css.container,
      nav: new Nav({
        onClick: (pageId) => this.addProps({currentPage: pageId}),
      }),
      ...props,
    });
  }

  getPageContent() {
    const element = new Button({text: `new one ${this.currentPage}`});
    const contentElement = document.getElementById('content');
    contentElement.replaceWith(element.getContent());
  }

  override render() {
    return `
        <div class="{{class}}">
          {{{ nav }}}
          <div id="content"></div>
        </div>
    `;
  }
}
