import { Block } from '../../framework/Block';
// import css from './index.module.css';
import { ErrorMessage } from '../../components';

export class notFoundPage extends Block {
	constructor() {
		super({
			message: new ErrorMessage({
				code: 404,
				message: 'page is not found',
				linkData: {
					text: 'back to chats',
					onClick: (event) => {
						event.preventDefault();
						event.stopPropagation();
					},
				},
			}),
		});
	}

	override render() {
		return `{{{message}}}`;
	}
}
