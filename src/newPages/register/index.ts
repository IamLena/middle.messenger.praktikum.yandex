import { Block } from "../../framework/Block";
import css from './index.module.css'
import { Form } from '../../components';

export type Props = {
  
};

export class RegisterPage extends Block {
  constructor(props: Props) {
    super({
      class: css.container,
      form: new Form({
        header: 'Please sign in',
        inputData: [{
            id: 'first_name',
            label: 'first name',
            type: 'text',
            name: 'first_name',
        },{
            id: 'second_name',
            label: 'second name',
            type: 'text',
            name: 'second_name',
        },{
            id: 'email',
            label: 'email',
            type: 'email',
            name: 'email',
        },{
            id: 'phone',
            label: 'phone',
            type: 'phone',
            name: 'phone',
        },{
            id: 'login',
            label: 'login',
            type: 'text',
            name: 'login',
        },{
            id: 'password',
            label: 'password',
            type: 'password',
            name: 'password',
        }],
        btnProps: { text: 'Sign up' },
      }),
      ...props,
    });
  }

  override render() {
    return `
      <div class="{{class}}">
        {{{ form }}}
      </div>
    `;
  }
}


