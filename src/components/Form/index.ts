import { Block } from '../../framework/Block';
import { Button, type ButtonProps } from '..';
import { Input, type InputProps } from '..';
import css from './index.module.css';

type FormDataShape = Record<string, string>;

export type Props = {
	header?: string;
	class?: string;
	btnProps: ButtonProps;
	inputData: InputProps[];
	submit: (data: FormDataShape) => void;
	resetOnSubmit?: boolean;
};

export class Form extends Block {
	private inputs: Input[];
	private submitAction: (data: FormDataShape) => void;
	private resetOnSubmit: boolean;

	constructor({
		btnProps,
		inputData,
		submit,
		resetOnSubmit = false,
		...props
	}: Props) {
		const button = new Button({
			...btnProps,
			type: btnProps.type ?? 'submit',
			onClick: (event) => {
				event.preventDefault();
				event.stopPropagation();
				this.submitForm();
				btnProps.onClick?.(event);
			},
		});

		const inputs = inputData.map((inputProps) => new Input(inputProps));

		super({
			...props,
			button,
			inputs,
		});

		this.inputs = inputs;
		this.submitAction = submit;
		this.resetOnSubmit = resetOnSubmit;
	}

	override componentDidUpdate(
		oldProps: Record<string, unknown>,
		newProps: Record<string, unknown>
	): boolean {
		if ('inputData' in newProps && newProps.inputData !== oldProps.inputData) {
			const nextInputs = (newProps.inputData as InputProps[]).map(
				(inputProps) => new Input(inputProps)
			);
			this.inputs = nextInputs;
			this.updateLists({
				inputs: nextInputs,
			});
		}
		return true;
	}

	private validate() {
		let isInvalid = false;
		const data = this.inputs.reduce<FormDataShape>((result, input) => {
			const validationResult = input.validate();
			const value = validationResult?.value ?? '';
			result[input.name] = value;
			if (!validationResult?.isValid) {
				isInvalid = true;
			}
			return result;
		}, {});
		return { data, isInvalid };
	}

	private resetInputs() {
		this.inputs.forEach((input) => input.setValue(''));
	}

	private submitForm() {
		const { data, isInvalid } = this.validate();
		if (!isInvalid) {
			this.submitAction(data);
			if (this.resetOnSubmit) {
				this.resetInputs();
			}
		}
	}

	public setButtonText(text: string) {
		const button = this.children.button as Button | undefined;
		button?.updateProps({ text });
	}

	public setInputsDisabled(disabled: boolean) {
		this.inputs.forEach((input) => {
			input.updateProps({ disabled });
		});
	}

	public setInputData(inputData: InputProps[]) {
		this.updateProps({ inputData });
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
