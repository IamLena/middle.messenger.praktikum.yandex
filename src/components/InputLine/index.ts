import { Block } from '../../framework/Block';
import { type EventsToPass } from '../../framework/EventBus';
import { type ValidationFunction } from '../../validation';
import css from './index.module.css';

export type setValidationErrorType = (error: string | undefined) => void;

export type Props = {
	id: string;
	type: string;
	name: string;
	value?: string;
	events?: EventsToPass;
	class?: string;
	validate: ValidationFunction;
	autocomplete?: string;
	setValidationError?: setValidationErrorType;
};

export class InputLine extends Block {
	constructor(props: Props) {
		super({
			...props,
			events: {
				blur: () => this.validate(),
			},
			isInvalid: false,
		});
	}

	validate() {
		const result = (this.props.validate as ValidationFunction)(
			this.getValue()
		);
		const { value, isValid, error } = result;
		this.props.value = value;
		this.props.isInvalid = !isValid;
		if (this.props.setValidationError) {
			(this.props.setValidationError as setValidationErrorType)(error);
		}
		return result;
	}

	getValue() {
		return (this.getContent() as HTMLInputElement).value;
	}

	override render() {
		return `
			<input
				class="${css.input} {{class}} ${this.props.isInvalid ? css.invalid : ''}"
				type="{{type}}"
				id="{{id}}"
				name="{{name}}"
				value="{{value}}"
				${this.props.autocomplete ? 'autocomplete="{{autocomplete}}"' : ''}
			>
		`;
	}
}
