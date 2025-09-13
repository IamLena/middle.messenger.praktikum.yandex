import { Block } from "../../framework/Block";
import css from './index.module.css'

export type AvatarProps = {
  text: string,
  onClick?: (event: Event) => void, 
  type?: string,
  class?: string,
};

export class Avatar extends Block {
  constructor({onClick, ...props}: AvatarProps) {
    super({
      ...props,
    });
  }

  override render() {
    return `
      <div class="${css.avatar}"></div>
    `;
  }
}
