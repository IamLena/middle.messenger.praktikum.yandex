import { Block } from "../../framework/Block";
import { Link, Search } from '../../components';
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
      }),
      search: new Search(),
    //   chats: new Chats(),
    });
  }

  override render() {
    return `
      <div class="{{class}}">
        {{ search }}
        {{ profileLink }}
        {{ chats }}
      </div>
    `;
  }
}


