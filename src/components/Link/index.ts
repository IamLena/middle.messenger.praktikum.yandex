import { Block } from "../../framework/Block";

export type LinkProps = {
  text: string,
  url?: string,
  onClick?: (...args: any[]) => void;
  class?: string,
};

export class Link extends Block {
  constructor({onClick, ...props}: LinkProps) {
    super({
      events: {
        'click': onClick,
      },
      // class: css.link,
      ...props,
    });
  }

  override render() {
    return '<a href="{{url}}" class="{{class}}">{{text}}</a>';
  }
}
