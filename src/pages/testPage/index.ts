
function render(query, block) {
  const root = document.querySelector(query);
  root.appendChild(block.getContent());
  block.dispatchComponentDidMount();
  return root;
}

const button = new Button({
		text: 'Click me',
});

// app — это class дива в корне DOM
render(".app", button);
