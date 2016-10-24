'use strict';

// NOTE: Run me on Node 6+!
const reduxEntity = require('./index');
const model = reduxEntity.model;
const loadEntity = reduxEntity.loadEntity;

// Redux state
let state = {};

// Invoke your custom thunk
fetchFoobar()(dispatch);

/**
 * Define custom thunk
 * @returns {*}
 */
function fetchFoobar() {
    return loadEntity(
        'foobar',
        _getFakePromise()
    );
}

/**
 * Simulate Redux's dispatch, with a logger
 * @param action
 */
function dispatch(action) {
    _logDetails(action);
    state = model(state, action);
    _logDetails();
}

/**
 * Generate a promise that resolves randomly between 1-3 seconds
  * @returns {Promise}
 * @private
 */
function _getFakePromise() {
    return new Promise((resolve) => {
        const delay = _getRandomDelayBetween(1, 3, 2);
        setTimeout(() => resolve({delay}), delay * 1000);
    });
}

/**
 * Generate a random number in a given range, and round to a given value
 * @param min
 * @param max
 * @param roundTo
 * @returns {string}
 * @private
 */
function _getRandomDelayBetween(min, max, roundTo) {
    return Number(Math.random() * (max - min) + min).toFixed(roundTo);
}

/**
 * Log Redux actions
 * @param action
 * @private
 */
function _logDetails(action) {
    if (action) {
        console.log(`PREV STATE: ${_format(state)}`);
        console.log(`    ACTION: ${_format(action)}`);
    } else {
        console.log(`NEXT STATE: ${_format(state)}`);
    }
}

/**
 * Format objects to a JSON string, and indent with 2 spaces
 * @param obj
 * @private
 */
function _format(obj) {
    return JSON.stringify(obj, null, 2)
}