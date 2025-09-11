import { Block } from "../../framework/Block";
import { Button, type ButtonProps } from '../Button';
import { Input, type InputProps } from '../Input';


export type FormProps = {
  header: string,
  class?: string,
  btnProps: ButtonProps,
  inputData: InputProps[],
};

export class Form extends Block {
  constructor({btnProps, inputData, ...props}: FormProps) {
    const button = new Button({
      ...btnProps,
      type: 'sumbit',
      onClick: (event) => {
          event.preventDefault();
          event.stopPropagation();
          console.log('click in form');
          this.getValues();
      },
    });

    const inputs = inputData.map(
        inputProps => new Input(inputProps)
    );

    super({button, inputs, ...props});
  }

  getValues() {
    const formElement = this.getContent();
    const formData = new FormData(formElement as HTMLFormElement);

    // Iterate through all key-value pairs
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  }

  override render() {
    return `
        <form class="{{class}}">
            <h1>{{header}}</h1>
            {{{ inputs }}}
            {{{ button }}}
        </form>
    `;
  }
}
