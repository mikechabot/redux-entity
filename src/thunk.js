'use strict';

const actionCreators = require('./common/action-creators');
const CONST = require('./common/const');

const DEFAULT_OPTIONS = CONST.DEFAULT_OPTIONS;
const STAGES = CONST.STAGES;

/**
 * Redux thunk action creator for making asynchronous API calls. This thunk
 * dispatches at least two actions: the first being the FETCH_REQUEST action,
 * which notifies the UI that fetching is occurring. The second action is dispatched
 * when either the API call succeeds or fails.
 *
 * More on Redux Thunk: https://github.com/gaearon/redux-thunk
 *
 * @param {string}  name        Entity name
 * @param {Promise} promise     Promise that loads data from an external source (e.g. OrderService.getOrders())
 * @param {object}  options     Configuration options object
 * @return {function}           A function that loads data from an external source, and dispatches actions
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
        options = __mergeWithDefaultOptions(options);

        if (!options.silent) {
            dispatch(
                actionCreators.fetchRequest(name)()
            );
        }

        function __processStage (stage, object) {
            const processor = options.processors[stage];
            if (processor) {
                processor(dispatch, object);
            }
        }

        return promise
            .then(data => {
                __processStage(STAGES.BEFORE_SUCCESS, data);
                dispatch(actionCreators.fetchSuccess(name)(data, __now(), options.append));
                __processStage(STAGES.AFTER_SUCCESS, data);
            })
            .catch(error => {
                __processStage(STAGES.BEFORE_FAILURE, error);
                dispatch(actionCreators.fetchFailure(name)(error, __now()));
                __processStage(STAGES.AFTER_FAILURE, error);
            });
    };
};

function __mergeWithDefaultOptions (options) {
    return Object.assign({}, DEFAULT_OPTIONS, options);
}

function __now () {
    return Date.now();
}
