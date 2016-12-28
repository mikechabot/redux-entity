'use strict';

const actionCreators = require('./action-creators');
const CONST = require('./const');
const STAGES = CONST.STAGES;

function Configuration (options) {
    this.options = Object.assign({}, CONST.DEFAULT_OPTIONS, options);
}

Configuration.prototype.getProcessors = function () {
    return this.options.processors;
};

Configuration.prototype.isSilent = function () {
    return this.options.silent;
};

Configuration.prototype.doAppend = function () {
    return this.options.append;
};

function Lifecycle (dispatch, name, options) {
    this.dispatch = dispatch;
    this.name = name;
    this.config = new Configuration(options);
}

Lifecycle.prototype.getName = function () {
    return this.name;
};

Lifecycle.prototype.fetchRequest = function () {
    if (!this.config.isSilent()) {
        this.dispatch(
            actionCreators.fetchRequest(this.getName())()
        );
    }
};

Lifecycle.prototype.fetchSuccess = function (data) {
    this.dispatch(
        actionCreators.fetchSuccess(this.getName())(data, __now(), this.config.doAppend())
    );
};

Lifecycle.prototype.fetchFailure = function (error) {
    this.dispatch(
        actionCreators.fetchFailure(this.getName())(error, __now())
    );
};

Lifecycle.prototype.beforeSuccess = function (data) {
    this.__processStage(STAGES.BEFORE_SUCCESS, data);
};

Lifecycle.prototype.afterSucces = function (data) {
    this.__processStage(STAGES.AFTER_SUCCESS, data);
};

Lifecycle.prototype.beforeFailure = function (error) {
    this.__processStage(STAGES.BEFORE_FAILURE, error);
};

Lifecycle.prototype.afterFailure = function (error) {
    this.__processStage(STAGES.AFTER_FAILURE, error);
};

Lifecycle.prototype.__processStage = function (stage, obj) {
    const processor = this.config.getProcessors()[stage];
    if (processor) {
        if (typeof processor !== 'function') throw new Error('processor must be a function');
        processor(this.dispatch, obj);
    }
};

function __now () {
    return Date.now();
}

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

