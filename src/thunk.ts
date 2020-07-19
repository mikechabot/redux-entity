import { ThunkAction } from 'redux-thunk';

import EntityLifecycle from './EntityLifecycle';

import { validate } from './util/validator';
import { fetchRequestCreator } from './actions';

import { GetState, ReduxEntityOptions, EntityAction, ReduxEntityState } from './types';

/**
 * Redux thunk action creator for performing asynchronous actions.
 *
 * @param {string}  entityName        Entity name
 * @param {Promise} promise     Promise (e.g. OrderService.getOrders())
 * @param {object}  options     Configuration options object
 * @return {function}           Perform an asynchronous action, dispatch Redux actions accordingly
 */
const GetEntity = (
  entityName: string,
  promise: Promise<any>,
  options?: ReduxEntityOptions
): ThunkAction<void, ReduxEntityState, unknown, EntityAction> => {
  if (!entityName || typeof entityName !== 'string') throw new Error('Missing required entityName');
  if (!promise || !promise.then) throw new Error('Missing required entity promise');

  validate(options);

  const lifecycle = new EntityLifecycle({ entityName, options });

  return (dispatch, getState: GetState) => {
    /**
     * Don't dispatch a fetch action if "GetEntity"
     * was invoked silently.
     */
    if (lifecycle.silent) {
      const fetchAction = fetchRequestCreator(entityName);
      dispatch(fetchAction());
    }
    return new Promise((resolve, reject) => {
      promise
        .then((data) => resolve(lifecycle.onSuccess(data, dispatch, getState)))
        .catch((error) => reject(lifecycle.onFailure(error, dispatch, getState)));
    });
  };
};

export default GetEntity;
