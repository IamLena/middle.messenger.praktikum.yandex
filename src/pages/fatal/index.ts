import { Block } from '../../framework/Block';
// import css from './index.module.css';
import { ErrorMessage } from '../../components';

export class fatalPage extends Block {
	constructor() {
		super({
			message: new ErrorMessage({
				code: 500,
				message: 'internal error',
			}),
		});
	}

	override render() {
		return `{{{message}}}`;
	}
}
