'use strict';

const {
    fetchRequest,
    fetchSuccess,
    fetchFailure
} = require('./action-creators');

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
 * @param  {boolean}    silent      Disable the FETCH_REQUEST action,
 * @return {function}               A function that loads data from an external source, and dispatches actions
 */
module.exports = function loadEntity(
    name,
    promise,
    silent = false
) {
    if (!promise || !promise.then)
        throw new Error('promise must be a Promise, and cannot be null/undefined');

    return (dispatch) => {

        if (!silent) {
            /**
             * Set the `isFetching` property on the entity to `true`.
             * The UI can hook into the store to obtain this property
             * from the entity, and optionally display a spinner or loading
             * indicator to the end-user.
             *
             * A reason to pass `silent` as true would be to
             * inhibit this loading indicator, if configured. For instance,
             * perhaps only the spinner should show when the component is
             * mounting, but subsequent updates to the entity are done
             * silently in the background.
             *
             * Regardless of whether the promise resolves or rejects,
             * `isFetching` is always set back to false in the reducer
             * via apiSuccess or apiFailure.
             */
            dispatch(fetchRequest(name)());
        }

        return promise
            .then(data => {
                // Dispatch success to update model state
                dispatch(
                    fetchSuccess(name)(data, Date.now())
                )
            })
            .catch(error => {
                // Dispatch failure to notify UI
                dispatch(
                    fetchFailure(name)(error, Date.now())
                )
            })
    }
};