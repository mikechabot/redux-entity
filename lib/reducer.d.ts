import { EntityAction, ReduxEntityState } from './types';
/**
 * Root reducer responsible for managing multiple entities
 * @param state
 * @param action
 */
export default function entities(state: ReduxEntityState | undefined, action: EntityAction): ReduxEntityState;
