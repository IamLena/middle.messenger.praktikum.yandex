import { store, StoreEvents } from './Store';
import { Block, type BlockProps } from '../framework/Block';
import type { AppState } from './types';

type MapStateToProps<P extends BlockProps> = (
	state: AppState
) => Partial<P> | void;

type GetInitialProps<P extends BlockProps> = () => Partial<P> | void;

export function connect<P extends BlockProps>(
	getDataFunction: GetInitialProps<P>,
	mapStateToProps: MapStateToProps<P>,
	Component: typeof Block
): typeof Block {
	return class extends Component {
		constructor(args?: Partial<P>) {
			const initialData = getDataFunction() ?? {};
			super({ ...(initialData as BlockProps), ...(args ?? {}) });
			store.on(StoreEvents.Updated, () => {
				const state = store.getState();
				const requiredProps = mapStateToProps(state);
				if (requiredProps) {
					this.updateProps(requiredProps);
				}
			});
		}
	};
}
