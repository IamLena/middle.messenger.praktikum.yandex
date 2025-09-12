import { Block } from "../../framework/Block";
import { type EventsToPass } from '../../framework/EventBus';

export type InputProps = {
  id: string,
  label: string,
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
        'blur': (event) => props.validate(event.target.value),
      }
    });
  }

  validate() {
    console.log('validate input');
    const value = this.getContent().querySelector(`#${this.props.id}`).value;
    return this.props.validate(value);
  }

  override render() {
    return `
        <div>
            <label for="{{id}}">{{label}}</label>
            <input type="{{type}}" id="{{id}}" name="{{name}}" value="{{value}}">
        </div>
    `;
  }
}
