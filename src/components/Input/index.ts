import { Block } from "../../framework/Block";
import { type EventsToPass } from '../../framework/EventBus';
import { Input as InputLine } from './input';

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
      input: new InputLine({
        ...props,
      }),
    });
  }

  validate() {
    return this.props.input.validate();
  }

  override render() {
    return `
        <div class="{{class}}">
            <label for="{{id}}">{{label}}</label>
            {{{ input }}}
        </div>
    `;
  }
}
