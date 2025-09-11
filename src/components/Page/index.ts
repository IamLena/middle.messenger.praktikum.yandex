import { Block } from "../../framework/Block";
import css from "./index.module.css";
import { Nav } from "..";
import { LoginPage, RegisterPage, ProfilePage } from "../../newPages";

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
      class: css.pageContent,
      ...props,
    });
  }

  changeCurrentPage(pageId: string) {
    let newContent: Block | null = null;

    switch (pageId) {
      case 'login':
        newContent = new LoginPage({});
        break;
      case 'register':
        newContent = new RegisterPage({});
        break;
      case 'profile':
        newContent = new ProfilePage({});
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
