import Handlebars from "handlebars";
import { Block } from "../framework/Block";
import buttonTemplate from "./button.tmpl";

export class Button extends Block {
  constructor(props) {
		// Создаём враппер дом-элемент button
    super(props);
  }

  override render() {
    console.log('render button');
    return buttonTemplate;
    // const template = Handlebars.compile(buttonTemplate);
    // const content = template(this.props);

    // return content;
  }
}

// function render(query, block) {
//   const root = document.querySelector(query);
//   root.appendChild(block.getContent());
//   block.dispatchComponentDidMount();
//   return root;
// }

// const button = new Button({
// 		text: 'Click me',
// });

// // app — это class дива в корне DOM
// render(".app", button);
