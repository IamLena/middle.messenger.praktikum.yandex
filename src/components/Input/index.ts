import { Block } from '../../framework/Block';
import { InputLine, type InputLineProps } from '..';
import css from './index.module.css';

export type Props = InputLineProps & {
	label?: string;
	class?: string;
};

export class Input extends Block {
	input: InputLine;

	constructor({ class: className, label, ...props }: Props) {
		const input = new InputLine({
			...props,
		});

		super({
			...props,
			label,
			class: className,
			input,
		});

		this.input = input;
	}

	validate() {
		return this.input.validate();
	}

	get name(): string {
		return this.props.name as string;
	}

	override render() {
		return `
			<div class="${css.input} {{class}}">
				<label for="{{id}}">{{label}}</label>
				{{{ input }}}
			</div>
		`;
	}
}
