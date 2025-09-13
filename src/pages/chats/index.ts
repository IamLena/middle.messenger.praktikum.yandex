import { Block } from "../../framework/Block";
import css from './index.module.css'
import { LeftPane } from "./leftPane";
import { RightPane } from "./rightPane";

export type Props = {
  
};

export class ChatsPage extends Block {
  constructor(props: Props) {
    super({
      ...props,
      leftPane: new LeftPane({}),
      rightPane: new RightPane({}),
    });
  }

  override render() {
    return `
      <div class="${css.container} {{class}}">
        {{{ leftPane }}}
        {{{ rightPane }}}
      </div>
    `;
  }
}


