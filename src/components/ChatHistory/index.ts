import { Block } from "../../framework/Block";
import css from './index.module.css'

export type ChatHistoryProps = {
  text: string,
  onClick?: (event: Event) => void, 
  type?: string,
  class?: string,
};

export class ChatHistory extends Block {
  constructor({onClick, ...props}: ChatHistoryProps) {
    super({
      ...props,
    });
  }

  override render() {
    return `
      <div class="${css.container}"></div>
    `;
  }
}
