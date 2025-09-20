import { Block } from '../../framework/Block';
import { Button, type ButtonProps } from '..';
import { Input, type InputProps } from '..';
import css from './index.module.css';

export type Props = {
	header?: string;
	class?: string;
	btnProps: ButtonProps;
	inputData: InputProps[];
};

export class Form extends Block {
	inputs: Input[];

	constructor({ btnProps, inputData, ...props }: Props) {
		const button = new Button({
			...btnProps,
			type: 'sumbit',
			onClick: (event) => {
				event.preventDefault();
				event.stopPropagation();
				this.submitForm();
				if (btnProps.onClick) {
					btnProps.onClick(event);
				}
			},
		});

		const inputs = inputData.map((inputProps) => new Input(inputProps));

		super({
			...props,
			button,
			inputs,
		});

		this.inputs = inputs;
	}

	validate() {
		const data = this.inputs.reduce(
			(result: Record<string, string | null>, input: Input) => {
				const validationResult = input.validate();
				result[input.name] = validationResult.isValid
					? validationResult.value
					: null;
				return result;
			},
			{}
		);
		return data;
	}

	submitForm() {
		const data = this.validate();
		console.log('form validated data', data);
	}

	override render() {
		return `
			<form class="${css.form} {{{class}}}">
				{{#if header}}
					<h1>{{header}}</h1>
				{{/if}}
				{{{ inputs }}}
				{{{ button }}}
			</form>
		`;
	}
}
