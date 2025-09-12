import { Block } from "../../framework/Block";
import css from './index.module.css'

export type Props = {
  
};

export class RightPane extends Block {
  constructor(props: Props) {
    super({
      ...props,
    });
  }

  override render() {
    return `
      <div class="{{class}}">
        {{ chatHistory }}
        {{ compose }}
      </div>
    `;
  }
}


