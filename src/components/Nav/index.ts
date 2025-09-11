import { Block } from "../../framework/Block";
import css from "./index.module.css";
import { Link } from "..";

export type NavProps = {
  class?: string;
  onClick: (pageId: string) => void;
};

const pageIds = ["login", "register", "profile", "chats", "notFound", "fatal"];

export class Nav extends Block {
  currentPage: string = "login";

  constructor(props: NavProps) {
    const pagesLinks = pageIds.map(
      (pageId) =>
        new Link({
          text: pageId,
          class: css.pageLink,
          onClick: (event: MouseEvent) => {
            event.preventDefault();
            console.log('cur page = ', pageId);
            // this.currentPage = pageId;
            props.onClick(pageId);
          },
        })
    );

    super({
      class: css.container,
      pagesLinks,
      ...props,
    });
  }

  override render() {
    return `
        <nav class="{{class}}">
            {{{ pagesLinks }}}
        </nav>
    `;
  }
}
