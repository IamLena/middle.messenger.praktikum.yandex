import { Block } from "../framework/Block";

export class Button extends Block {
  constructor(props) {
		// Создаём враппер дом-элемент button
    super("button", props);
  }

  render() {
		// В проекте должен быть ваш собственный шаблонизатор
    return `<div>${this.props.text}</div>`;
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
