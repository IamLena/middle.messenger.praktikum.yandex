import { Block } from '../../framework/Block';
import { Button, type ButtonProps } from '..';
import { Input, type InputProps } from '..';
import css from './index.module.css';
import { connect } from '../../store/connect';

export type Props = {
	header?: string;
	class?: string;
	btnProps: ButtonProps;
	inputData: InputProps[];
	submit: (data: Record<string, string>) => void;
};

export class Form extends Block {
	inputs: Input[];
	submitAction: (data: Record<string, string>) => void;

	constructor({ btnProps, inputData, submit, ...props }: Props) {
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

		// with input should be connected to each field of currentuser to work
		// const ConnectedInput = connect(() => {}, () => {}, Input);
		const inputs = inputData.map((inputProps) => new Input(inputProps));

		super({
			...props,
			button,
			inputs,
		});

		this.inputs = inputs;
		this.submitAction = submit;
	}

	override componentDidUpdate(oldProps, newProps) {
		if ('inputData' in newProps) {
			this.updateLists({
				inputs: newProps.inputData.map(
					(inputProps) => new Input(inputProps)
				),
			});
		}
		return true;
	}

	validate() {
		let isInvalid = false;
		const data = this.inputs.reduce(
			(result: Record<string, string>, input: Input) => {
				const validationResult = input.validate();
				result[input.name] = validationResult.value;
				if (!validationResult.isValid) {
					isInvalid = true;
				}
				return result;
			},
			{}
		);
		return { data, isInvalid };
	}

	submitForm() {
		const { data, isInvalid } = this.validate();
		if (!isInvalid) {
			this.submitAction(data);
		}
	}

	override render() {
		return `
			<form class="${css.form} {{class}}">
				{{#if header}}
					<h1>{{header}}</h1>
				{{/if}}
				{{{ inputs }}}
				{{{ button }}}
			</form>
		`;
	}
}
