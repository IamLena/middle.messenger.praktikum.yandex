import { Block } from "../../framework/Block";
import { type EventsToPass } from '../../framework/EventBus';

export type LinkProps = {
  url: string,
  text: string,
  events?: EventsToPass,
  class?: string,
};

export class Link extends Block {
  constructor(props: LinkProps) {
    super(props);
  }

  override render() {
    return '<a href="{{url}}" class="{{class}}">{{text}}</a>';
  }
}
