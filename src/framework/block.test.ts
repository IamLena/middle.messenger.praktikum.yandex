import { jest } from '@jest/globals';
import { Block } from './Block';

describe('Block', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	test('renders template with props', () => {
		const label = 'click me';

		class ButtonBlock extends Block {
			override render(): string {
				return '<button>{{label}}</button>';
			}
		}

		const block = new ButtonBlock({
			label,
		});

		const element = block.getContent();

		expect(element.tagName).toBe('BUTTON');
		expect(element.textContent).toBe(label);
	});

	test('adds event listeners and handlers', () => {
		const handleClick = jest.fn();
		const label = 'click me';

		class ButtonBlock extends Block {
			override render(): string {
				return '<button>{{label}}</button>';
			}
		}

		const block = new ButtonBlock({
			label,
			events: {
				click: handleClick,
			},
		});

		const element = block.getContent();
		element.dispatchEvent(new Event('click'));

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	test('updateProps triggers componentDidUpdate and rerenders with new data', () => {
		const updates: Array<{ old?: unknown; new?: unknown }> = [];
		class UpdatableBlock extends Block {
			constructor() {
				super({
					title: 'old',
				});
			}

			override componentDidUpdate(
				oldProps: Record<string, unknown>,
				newProps: Record<string, unknown>
			): boolean {
				updates.push({
					old: oldProps.title,
					new: newProps.title,
				});
				return true;
			}

			override render(): string {
				return `<div class="title">{{title}}</div>`;
			}
		}

		const block = new UpdatableBlock();

		block.updateProps({ title: 'new' });

		expect(updates).toEqual([{ old: 'old', new: 'new' }]);
		expect(block.getContent().textContent).toBe('new');
	});

	test('renders child Block', () => {
		class ChildBlock extends Block {
			override render(): string {
				return `<span id="child">{{label}}</span>`;
			}
		}

		class ParentBlock extends Block {
			override render(): string {
				return `<div class="parent"><h1>{{title}}</h1>{{{child}}}</div>`;
			}
		}

		const child = new ChildBlock({ label: 'this is child' });
		const parent = new ParentBlock({ title: 'this is parent', child });

		const parentElement = parent.getContent();
		const heading = parentElement.querySelector('h1');
		expect(heading?.textContent).toBe('this is parent');
		expect(parentElement.innerHTML).toBe(
			'<h1>this is parent</h1><span id="child">this is child</span>'
		);

		const childElement = parentElement.querySelector('#child');
		expect(childElement).not.toBeNull();
		expect(childElement?.textContent).toBe('this is child');
	});

	test('renders lists', () => {
		class ListItemBlock extends Block {
			override render(): string {
				return '<li class="item">{{text}}</li>';
			}
		}

		class ListBlock extends Block {
			override render(): string {
				return '<ul class="list">{{{items}}}</ul>';
			}
		}

		const item1 = new ListItemBlock({ text: 'First' });
		const item2 = new ListItemBlock({ text: 'Second' });

		const listBlock = new ListBlock({
			items: [item1, item2],
		});

		const listElement = listBlock.getContent();
		const renderedItems = Array.from(
			listElement.querySelectorAll('li')
		).map((node) => node.textContent);

		expect(renderedItems).toEqual(['First', 'Second']);
	});

	test('updateLists triggers rerender with new list items', () => {
		class ListItemBlock extends Block {
			override render(): string {
				return '<li class="item">{{text}}</li>';
			}
		}

		class ListBlock extends Block {
			override render(): string {
				return '<ul class="list">{{{items}}}</ul>';
			}
		}

		const item1 = new ListItemBlock({ text: 'First' });
		const item2 = new ListItemBlock({ text: 'Second' });

		const listBlock = new ListBlock({
			items: [item1, item2],
		});

		const listElement = listBlock.getContent();
		const renderedItems = Array.from(
			listElement.querySelectorAll('li')
		).map((node) => node.textContent);

		expect(renderedItems).toEqual(['First', 'Second']);

		const item3 = new ListItemBlock({ text: 'Third' });

		listBlock.updateLists({
			items: [item1, item2, item3],
		});

		const updatedListElement = listBlock.getContent();
		const updatedRenderedItems = Array.from(
			updatedListElement.querySelectorAll('li')
		).map((node) => node.textContent);

		expect(updatedRenderedItems).toEqual(['First', 'Second', 'Third']);
	});
});
