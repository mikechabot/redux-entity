import { Dispatch } from 'redux';

import { GetState, OptionKey, ReduxEntityOptions } from './types';

import EntityLifecycle from './EntityLifecycle';

import { validate } from './util/validator';
import { fetchRequestCreator } from './actions';

/**
 * Redux thunk action creator for performing asynchronous actions.
 *
 * @param {string}  name        Entity name
 * @param {Promise} promise     Promise (e.g. OrderService.getOrders())
 * @param {object}  options     Configuration options object
 * @return {function}           Perform an asynchronous action, dispatch Redux actions accordingly
 */

const GetEntity = (entityName: string, promise: Promise<any>, options: ReduxEntityOptions) => {
  if (!entityName || typeof entityName !== 'string') throw new Error('Missing required entityName');
  if (!promise || !promise.then) throw new Error('Missing required entity promise');

  validate(options);

  const entityLifecycle = new EntityLifecycle({ entityName, options });

  return (dispatch: Dispatch, getState: GetState) => {
    if (!options || !options[OptionKey.SILENT]) {
      const fetchAction = fetchRequestCreator(entityName);
      dispatch(fetchAction());
    }

    return new Promise((resolve, reject) => {
      promise
        .then((data) => resolve(entityLifecycle.onSuccess(data, dispatch, getState)))
        .catch((error) => reject(entityLifecycle.onFailure(error, dispatch, getState)));
    });
  };
};

export default GetEntity;
