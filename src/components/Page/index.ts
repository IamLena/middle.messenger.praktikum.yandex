import { Block } from "../../framework/Block";
import css from "./index.module.css";
import { Nav } from "..";
import { LoginPage, RegisterPage, ProfilePage } from "../../newPages";
import { ErrorMessage } from "../ErrorMessage";

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
      case 'notFound':
        newContent = new ErrorMessage({
          code: 404,
          message: 'page is not found',
          linkData: {
            text: 'back to chats',
            onClick: (event) => {
              event.preventDefault();
              event.stopPropagation();
              console.log('back to chats');
            },
          }
        });
        break;
      case 'fatal':
        newContent = new ErrorMessage({
          code: 500,
          message: 'internal error',
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
