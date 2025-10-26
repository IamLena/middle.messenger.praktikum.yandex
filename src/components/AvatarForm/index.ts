import { Block } from '../../framework/Block';
import css from './index.module.css';
import { type AvatarData } from '../../types.ts';
import { resourceController } from '../../controllers/resourceController.ts';

export type Props = {
	value?: string;
	updateMethod: (data: AvatarData) => unknown;
	disabled?: boolean;
};

export class AvatarForm extends Block {
	private selectedFile: File | null = null;
	private objectUrl: string | null = null;

	constructor({ value, updateMethod, disabled = false }: Props) {
		super({
			showButton: false,
			value,
			updateMethod,
			previewSrc: undefined,
			disabled,
			events: {
				submit: (event: Event) => this.handleSubmit(event),
				change: (event: Event) => this.handleChange(event),
			},
		});

		if (value) {
			void this.applyValuePreview(value);
		}
	}

	private handleChange = (event: Event) => {
		const target = event.target as HTMLInputElement | null;
		if (!target || target.type !== 'file') {
			return;
		}

		const [file] = target.files ?? [];
		this.selectedFile = file ?? null;

		if (this.selectedFile) {
			this.revokeObjectUrl();
			const preview = URL.createObjectURL(this.selectedFile);
			this.objectUrl = preview;
			this.props.previewSrc = preview;
			this.updateProps({ showButton: true });
		} else {
			this.resetToValuePreview();
		}
	};

	private async handleSubmit(event: Event) {
		event.preventDefault();

		if (!this.selectedFile) {
			alert('Please select an image before uploading.');
			return;
		}

		const formData = new FormData();
		formData.append('avatar', this.selectedFile);

		try {
			const updater = this.props.updateMethod as Props['updateMethod'];
			await Promise.resolve(updater(formData));
			const input = this.getFileInput();
			if (input) {
				input.value = '';
			}
			this.selectedFile = null;
			this.updateProps({ showButton: false });
		} catch {
			alert('Failed to upload avatar. Please try again.');
		}
	}

	private async applyValuePreview(value: string) {
		const normalizedPath = this.normalizePath(value);
		this.props.previewSrc = resourceController.getSrc(normalizedPath);
	}

	private normalizePath(path: string): string {
		if (!path) {
			return '';
		}

		if (/^https?:\/\//i.test(path)) {
			try {
				const url = new URL(path);
				return url.pathname.replace(/^\/+/, '');
			} catch {
				return path.replace(/^\/+/, '');
			}
		}

		return path.replace(/^\/+/, '');
	}

	private getFileInput(): HTMLInputElement | null {
		try {
			return this.getContent().querySelector(
				'input[type="file"][name="avatar"]'
			) as HTMLInputElement | null;
		} catch {
			return null;
		}
	}

	private revokeObjectUrl() {
		if (this.objectUrl) {
			URL.revokeObjectURL(this.objectUrl);
			this.objectUrl = null;
		}
	}

	private clearSelection() {
		this.revokeObjectUrl();
		this.selectedFile = null;
		const input = this.getFileInput();
		if (input) {
			input.value = '';
		}
	}

	private resetToValuePreview() {
		this.clearSelection();
		const value = this.props.value as string | undefined;
		if (value) {
			void this.applyValuePreview(value);
		} else {
			this.props.previewSrc = undefined;
		}
		this.updateProps({ showButton: false });
	}

	public resetInputs() {
		this.resetToValuePreview();
	}

	protected override componentDidUpdate(
		oldProps: Record<string, unknown>,
		newProps: Record<string, unknown>
	): boolean {
		if (oldProps.value !== newProps.value) {
			if (typeof newProps.value === 'string' && newProps.value !== '') {
				this.clearSelection();
				void this.applyValuePreview(newProps.value);
			} else {
				this.resetToValuePreview();
			}
		}
		return true;
	}

	override render(): string {
		return `
			<form class="${css.form}">
				{{#if previewSrc}}
					<img class="${css.avatar}" src="{{previewSrc}}" alt="current avatar" />
				{{/if}}
				<label for="avatar">change avatar</label>
				<input class="${css.file} "id="avatar" type="file" name="avatar" accept="image/*" {{#if disabled}}disabled{{/if}}>
				{{#if showButton}}
					<button type="submit">save</button>
				{{/if}}
			</form>
		`;
	}
}
