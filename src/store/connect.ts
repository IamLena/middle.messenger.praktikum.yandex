import { store, StoreEvents } from './Store';
import { Block } from '../framework/Block';

export function connect(
	getDataFunction,
	mapStateToProps,
	Component: typeof Block
): typeof Block {
	return class extends Component {
		constructor(args) {
			const data = getDataFunction();
			super({ ...data, ...args });
			store.on(StoreEvents.Updated, () => {
				const state = store.getState();
				const requiredProps = mapStateToProps(state);
				this.updateProps(requiredProps);
			});
		}
	};
}
