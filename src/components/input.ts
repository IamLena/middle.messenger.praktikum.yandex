import { Block } from "../framework/Block";
import { type EventsToPass } from '../framework/EventBus';

type InputProps = {
  id: string,
  label: string,
  type: string,
  name: string,
  value?: string
  events?: EventsToPass,
  class?: string,
};

export class Input extends Block {
  constructor(props: InputProps) {
    super(props);
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
