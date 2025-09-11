import { Block } from "../framework/Block";
import { type EventsToPass } from '../framework/EventBus';
import css from './button.module.css'


type ButtonProps = {
  text: string,
  type: string,
  onClick: () => void, // условно функция
  // events?: EventsToPass,
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
    return '<button class="{{class}}" type="{{type}}">{{text}}</button>';
  }
}
