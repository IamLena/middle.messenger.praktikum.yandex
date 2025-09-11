import { Block } from "../../framework/Block";
import css from './index.module.css'
import { Form } from '../../components';

export type Props = {
  
};

export class ProfilePage extends Block {
  constructor(props: Props) {
    super({
      class: css.container,
      form: new Form({
        header: 'Profile',
        inputData: [{
            id: 'avatar',
            label: 'upload avatar image',
            type: 'file',
            name: 'avatar',
        },{
            id: 'first_name',
            label: 'first name',
            type: 'text',
            name: 'first_name',
            value: 'my first name',
        },{
            id: 'second_name',
            label: 'second name',
            type: 'text',
            name: 'second_name',
            value: 'my second name',
        },{
            id: 'display_name',
            label: 'display name',
            type: 'text',
            name: 'display_name',
            value: 'my display name',
        },{
            id: 'email',
            label: 'email',
            type: 'email',
            name: 'email',
            value: 'my@email.com',
        },{
            id: 'phone',
            label: 'phone',
            type: 'phone',
            name: 'phone',
            value: '+7(777)777-77-77',
        },{
            id: 'login',
            label: 'login',
            type: 'text',
            name: 'login',
            value: 'login',
        },{
            id: 'oldPassword',
            label: 'old password',
            type: 'password',
            name: 'oldPassword',
        },{
            id: 'newPassword',
            label: 'new password',
            type: 'password',
            name: 'newPassword',
        }],
        btnProps: { text: 'Save' },
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


