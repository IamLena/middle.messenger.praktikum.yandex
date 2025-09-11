import { Block } from "../../framework/Block";
import css from './index.module.css'

export type ButtonProps = {
  text: string,
  onClick: () => void, 
  type?: string,
  class?: string,
};

export class Button extends Block {
  constructor({onClick, ...props}: ButtonProps) {
    super({
      events: {
        'click': onClick,
      },
      class: css.button,
      ...props,
    });
  }

  override render() {
    return `
      <button class="{{class}}" type="{{type}}">
        {{text}}
      </button>
    `;
  }
}
