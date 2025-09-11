import { Block } from "../../framework/Block";
// import css from "./index.module.css";
import { Nav, Button } from "..";

export type PageProps = {
  class?: string;
};

export class Page extends Block {
  // currentPage: string = "login";

  constructor(props: PageProps) {
    super({
      nav: new Nav({
        onClick: (pageId) => this.changeCurrentPage(pageId),
      }),
      pageContent: '',
      ...props,
    });
  }

  changeCurrentPage(pageId: string) {
    let newContent: Block | null = null;

    switch (pageId) {
      case 'login':
        // no proxy on children so it doesnt trigger rerender - this.pageContent = ...
        // do it явно
        newContent = new Button({
          text: 'hehe',
          onClick: () => {},
        });
        break;
      case 'register':
        // no proxy on children so it doesnt trigger rerender - this.pageContent = ...
        // do it явно
        newContent = new Button({
          text: 'olololo',
          onClick: () => {},
        });
        break;
      }

      if (newContent) {
        // this will triger rerender
        this.changeChild({
          pageContent: newContent
        })
      }
  }

  override render() {
    return `
        <div class="{{class}}">
          {{{ nav }}}
          {{{ pageContent }}}
        </div>
    `;
  }
}
