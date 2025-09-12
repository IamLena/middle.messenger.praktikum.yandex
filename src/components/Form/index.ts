import { Block } from "../../framework/Block";
import { Button, type ButtonProps } from '../Button';
import { Input, type InputProps } from '../Input';
import css from './index.module.css'

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
          this.submitForm();
          if (btnProps.onClick) {
            btnProps.onClick(event);
          }
      },
    });

    const inputs = inputData.map(
        inputProps => new Input(inputProps)
    );

    super({
      ...props,
      button,
      inputs,
    });
  }

  // getValues() {
  //   const formElement = this.getContent();
  //   const formData = new FormData(formElement as HTMLFormElement);

  //   for (const [key, value] of formData.entries()) {
  //     console.log(`${key}: ${value}`);
  //   }

  //   return formData;
  // }

  validate() {
    return this.props.inputs.map(input => {
      console.log('input', input);
      return input.validate();
    });
  }

  submitForm() {
    const data = this.validate();
    console.log('data', data);
  }

  override render() {
    return `
        <form class="${css.form} {{{class}}}">
            <h1>{{header}}</h1>
            {{{ inputs }}}
            {{{ button }}}
        </form>
    `;
  }
}
