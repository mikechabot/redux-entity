import { ThunkAction } from 'redux-thunk';
import { ReduxEntityOptions, EntityAction, ReduxEntityState } from './types';
/**
 * Redux thunk action creator for performing asynchronous actions.
 *
 * @param {string}  entityName        Entity name
 * @param {Promise} promise     Promise (e.g. OrderService.getOrders())
 * @param {object}  options     Configuration options object
 * @return {function}           Perform an asynchronous action, dispatch Redux actions accordingly
 */
declare const GetEntity: (
  entityName: string,
  promise: Promise<any>,
  options?: ReduxEntityOptions | undefined
) => ThunkAction<void, ReduxEntityState, unknown, EntityAction>;
export default GetEntity;
