'use strict';

const EntityLifecycle = require('./common/entity-lifecycle');

/**
 * Redux thunk action creator for performing asynchronous actions.
 *
 * @param {string}  name        Entity name
 * @param {Promise} promise     Promise (e.g. OrderService.getOrders())
 * @param {object}  options     Configuration options object
 * @return {function}           Perform an asynchronous action, dispatch Redux actions accordingly
 */
module.exports = function loadEntity (
    name,
    promise,
    options
) {
    if (!name || typeof name !== 'string') throw new Error('Missing required entity name');
    if (!promise || !promise.then) throw new Error('Missing required entity promise');
    if (options && options.constructor !== Object) throw new Error('Expected options to be an object');
    const _el = new EntityLifecycle(name, options);
    return (dispatch) => {
        _el.setDispatch(dispatch);
        _el.onLoad();
        return promise
            .then(data => { _el.onSuccess(data); })
            .catch(error => { _el.onFailure(error); });
    };
};
