import { Block } from "../../framework/Block";
import {Link, type LinkProps } from "../Link";
import css from './index.module.css'

export type ErrorMessageProps = {
  message: string,
  code: number,
  linkData?: LinkProps,
  class?: string,
};

export class ErrorMessage extends Block {
  constructor({linkData, ...props}: ErrorMessageProps) {
    super({
      ...props,
      link: linkData ? new Link(linkData) : undefined,
    });
  }

  override render() {
    return `
    <div class="${css.container}">
      <div class="${css.error}">
        <span class="${css.code}">{{ code }}</span>
        <span class="${css.message}">{{ message }}</span>
        {{{ link }}}
      </div>
    </div>
    `;
  }
}
