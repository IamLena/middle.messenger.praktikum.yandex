import { Block } from "../../framework/Block";
import { Form, ChatHistory } from '../../components';
import css from './index.module.css'

export type Props = {
  
};

export class RightPane extends Block {
  constructor(props: Props) {
    super({
      ...props,
      compose: new Form({
        class: css.inlineForm,
        inputData: [{
            id: 'send',
            label: 'send:',
            type: 'text',
            name: 'send',
            validate: (value) => {
              console.log('send', value);
              return value;
            },
            class: css.inputContainer,
        }],
        btnProps: {
          text: 'send',
        }
      }),
      chatHistory: new ChatHistory({}),
    });
  }

  override render() {
    return `
      <div class="${css.rightPane} {{class}}">
        {{{ chatHistory }}}
        {{{ compose }}}
      </div>
    `;
  }
}


