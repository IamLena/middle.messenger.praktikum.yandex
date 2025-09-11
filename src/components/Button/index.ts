import { Block } from "../../framework/Block";
import css from './index.module.css'

export type ButtonProps = {
  text: string,
  type: string,
  onClick: () => void, 
  class?: string,
};

export class Button extends Block {
  constructor({onClick, ...props}: ButtonProps) {
    super({
      events: {
        'click': onClick,
      },
      ...props,
      class: css.button,
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
