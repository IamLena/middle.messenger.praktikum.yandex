import { Block } from "../../framework/Block";
import { Link, Form, Chat } from '../../components';
import { Input as InputLine } from '../../components/Input/input';
import css from './index.module.css'

export type Props = {
  
};

export class LeftPane extends Block {
  constructor(props: Props) {
    super({
      ...props,
      profileLink: new Link({
        text: 'profile',
        url: '#',
        class: css.profileLink,
      }),
      search: new InputLine({
        id: 'search',
        label: 'search:',
        type: 'text',
        name: 'search',
        validate: (value) => {
          console.log('search', value);
          return value;
        },
      }),
      chats: [
        new Chat({}),
        new Chat({}),
        new Chat({}),
      ]
    });
  }

  override render() {
    return `
      <div class="${css.leftPane}">
        {{{ profileLink }}}
        {{{ search }}}
        {{{ chats }}}
      </div>
    `;
  }
}


