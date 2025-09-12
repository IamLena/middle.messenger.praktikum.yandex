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
      link: linkData ? new Link(linkData) : undefined,
      ...props,
    });
  }

  override render() {
    return `
    <div class="${css.container}">
      <h1 class="${css.code}">{{ code }}</h1>
      <p class="${css.message}">{{ message }}</p>
      {{{ link }}}
    </div>
    `;
  }
}
