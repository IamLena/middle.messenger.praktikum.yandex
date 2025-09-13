import { Block } from "../../framework/Block";
import { Avatar } from "../Avatar";
import css from './index.module.css'

export type ChatProps = {
  text: string,
  onClick?: (event: Event) => void, 
  type?: string,
  class?: string,
};

export class Chat extends Block {
  constructor({onClick, ...props}: ChatProps) {
    super({
      ...props,
      events: {
        'click': onClick,
      },
      avatar: new Avatar({}),
    });
  }

  override render() {
    return `
      <div class="${css.chatContainer}">
        {{{ avatar }}}
      </div>
    `;
  }
}
