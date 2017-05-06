'use strict';

var EntityLifecycle = require('./common/entity-lifecycle');

/**
 * Redux thunk action creator for performing asynchronous actions.
 *
 * @param {string}  name        Entity name
 * @param {Promise} promise     Promise (e.g. OrderService.getOrders())
 * @param {object}  options     Configuration options object
 * @return {function}           Perform an asynchronous action, dispatch Redux actions accordingly
 */
module.exports = function loadEntity(name, promise, options) {
    if (!name || typeof name !== 'string') throw new Error('Missing required entity name');
    if (!promise || !promise.then) throw new Error('Missing required entity promise');
    if (options && options.constructor !== Object) throw new Error('Expected options to be an object');
    var _el = new EntityLifecycle(name, options);
    return function (dispatch) {
        _el.setDispatch(dispatch);
        _el.onLoad();
        return promise.then(function (data) {
            _el.onSuccess(data);
        }).catch(function (error) {
            _el.onFailure(error);
        });
    };
};