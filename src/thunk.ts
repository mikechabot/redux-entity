import { Dispatch } from 'redux';

import EntityLifecycle from './common/EntityLifecycle';
import validate from './util/validator';
import { fetchRequestCreator } from './actions';
import { EntityLifecycleOptions, GetState } from './types';

/**
 * Redux thunk action creator for performing asynchronous actions.
 *
 * @param {string}  name        Entity name
 * @param {Promise} promise     Promise (e.g. OrderService.getOrders())
 * @param {object}  options     Configuration options object
 * @return {function}           Perform an asynchronous action, dispatch Redux actions accordingly
 */

export default function loadEntity(entityName: string, promise: Promise<any>, options: EntityLifecycleOptions) {
  if (!entityName) throw new Error('Missing required entityName');
  if (!promise || !promise.then) throw new Error('Missing required entity promise');

  validate(options);

  const entityLifecycle = new EntityLifecycle({ entityName, options });

  return (dispatch: Dispatch, getState: GetState) => {
    const fetchAction = fetchRequestCreator(entityName);
    dispatch(fetchAction());
    return new Promise((resolve, reject) => {
      promise
        .then((data: any) => resolve(entityLifecycle.onSuccess(data, dispatch, getState)))
        .catch((error: any) => reject(entityLifecycle.onFailure(error, dispatch, getState)));
    });
  };
}
