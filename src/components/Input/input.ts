import { Block } from "../../framework/Block";
import { type EventsToPass } from '../../framework/EventBus';

export type InputProps = {
  id: string,
  type: string,
  name: string,
  value?: string
  events?: EventsToPass,
  class?: string,
  validate: (value: string) => string | null;
};

export class Input extends Block {
  constructor(props: InputProps) {
    super({
      ...props,
      events: {
        'focus': () => {console.log('focus')},
        'blur': () => this.validate(),
        // 'click': () => {console.log('click')},
      }
    });
  }

  getValue() {
    return this.getContent().value;
  }

  validate() {
    if (this.props.validate) {
      console.log('validate input');
      return this.props.validate(this.getValue());
    }
  }

  override render() {
    return `
      <input type="{{type}}" id="{{id}}" name="{{name}}" value="{{value}}">
    `;
  }
}
