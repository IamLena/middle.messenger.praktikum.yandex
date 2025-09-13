import { Block } from "../../framework/Block";
import css from './index.module.css'
import { Form, Link } from '../../components';
import { loginValidation, passwordValidation } from '../../validation';

export type Props = {
  
};

export class LoginPage extends Block {
  constructor(props: Props) {
    super({
      class: css.container,
      form: new Form({
        header: 'Please sign in',
        inputData: [{
            id: 'login',
            label: 'login:',
            type: 'text',
            name: 'login',
            validate: loginValidation,
        }, {
            id: 'password',
            label: 'password:',
            type: 'password',
            name: 'password',
            validate: passwordValidation,
        }],
        btnProps: { text: 'Sign in' },
      }),
      linkToRegistration: new Link({
        text: 'Register',
        url: '#',
      }),
      ...props,
    });
  }

  override render() {
    return `
      <div class="{{class}}">
        {{{ form }}}
        <div>
          <span>Don't have an account?</span>
          {{{ linkToRegistration }}}
        </div>
      </div>
    `;
  }
}


