'use strict';

const actionCreators = require('./common/action-creators');

/**
 * Redux thunk action creator for making asynchronous API calls. This thunk
 * dispatches at least two actions: the first being the FETCH_REQUEST action,
 * which notifies the UI that fetching is occurring. The second action is dispatched
 * when either the API call succeeds or fails.
 *
 * More on Redux Thunk: https://github.com/gaearon/redux-thunk
 *
 * @param  {string}     name        Entity name
 * @param  {Promise}    promise     Promise that loads data from an external source (e.g. OrderService.getOrders())
 * @param  {boolean}    silent      Disable the FETCH_REQUEST action
 * @param  {object}     processors  Holds functions that manipulates entity data
 * @return {function}               A function that loads data from an external source, and dispatches actions
 */
module.exports = function loadEntity(
    name,
    promise,
    processors,
    silent
) {
    if (!name || typeof name !== 'string') throw new Error('name is required and must be a String');
    if (!promise || !promise.then) throw new Error('promise is required and must be a Promise');
    if (processors && typeof processors !== 'object') throw new Error('processors must be an object');

    return (dispatch) => {

        _processStage = _processStage.bind(this, processors, dispatch);

        if (!silent) {
            /**
             * When fetchRequest is dispatched, the `isFetching` property
             * on the entity is set to `true`. The UI can hook into this
             * property, and optionally display a spinner or loading
             * indicator to the end-user.
             *
             * A reason to pass `silent` as true would be to
             * inhibit this loading indicator, if configured. For instance,
             * perhaps only the spinner should show when the component is
             * mounting, but subsequent updates to the entity are done
             * silently in the background.
             */
            dispatch(actionCreators.fetchRequest(name)());
        }

        return promise
            .then(data => {
                _processStage(STAGE.BEFORE_SUCCESS, data);
                dispatch(actionCreators.fetchSuccess(name)(data), Date.now());
                _processStage(STAGE.AFTER_SUCCESS, data);
            })
            .catch(error => {
                _processStage(STAGE.BEFORE_FAILURE, error);
                dispatch(actionCreators.fetchFailure(name)(error, Date.now()));
                _processStage(STAGE.AFTER_FAILURE, error);
            })
    }
};

/**
 * Processor types
 * @type {{BEFORE_SUCCESS: string, AFTER_SUCCESS: string, BEFORE_FAILURE: string, AFTER_FAILURE: string}}
 */
const STAGE = {
    BEFORE_SUCCESS  : 'beforeSuccess',
    AFTER_SUCCESS   : 'afterSuccess',
    BEFORE_FAILURE  : 'beforeFailure',
    AFTER_FAILURE   : 'afterFailure'
};

/**
 * Execute a processor of a given type if it exists
 * @param processors
 * @param dispatch
 * @param data
 * @param type
 * @returns {*}
 * @private
 */
function _processStage(processors, dispatch, type, data) {
    if (processors[type]) {
        return processors[type](dispatch, data);
    }
}