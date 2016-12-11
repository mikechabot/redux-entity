'use strict';

const Lifecycle = require('./common/lifecycle');

/**
 * Redux thunk action creator for making asynchronous API calls. This thunk
 * dispatches at least two actions:
 *
 *        1) FETCH_REQUEST action, which sets the "isFetching" property to "true" on the entity.
 *        2.) FETCH_SUCCESS/FETCH_FAILURE, depending on whether the promise resolve or rejects.
 *
 * More on Redux Thunk: https://github.com/gaearon/redux-thunk
 *
 * @param {string}  name        Entity name
 * @param {Promise} promise     Promise that loads data from an external source (e.g. OrderService.getOrders())
 * @param {object}  options     Configuration options object
 * @return {function}           A function that loads data from an external source, and dispatches Redux actions
 */
module.exports = function loadEntity (
    name,
    promise,
    options
) {
    if (!name || typeof name !== 'string') throw new Error('name is required, and must be a String');
    if (!promise || !promise.then) throw new Error('promise is required, and must be a Promise');
    if (options && options.constructor !== Object) throw new Error('options must be an Object');

    return (dispatch) => {
        const __lc = new Lifecycle(dispatch, name, options);

        __lc.fetchRequest();

        return promise
            .then(data => {
                __lc.beforeSuccess(data);
                __lc.fetchSuccess(data);
                __lc.afterSucces(data);
            })
            .catch(error => {
                __lc.beforeFailure(error);
                __lc.fetchFailure(error);
                __lc.afterFailure(error);
            });
    };
};
