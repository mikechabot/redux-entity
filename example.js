'use strict';

const model = require('redux-entity').model;
const loadEntity = require('redux-entity').loadEntity;
const chalk = require('chalk');

// Redux state
let state = {};

// Invoke your custom thunk
fetchFoobar()(dispatch);

/**
 * Define custom thunk
 * @returns {*}
 */
function fetchFoobar () {
    return loadEntity(
        'foobar',
        _getFakePromise(),
        null
    );
}

/**
 * Simulate Redux's dispatch, with a logger
 * @param action
 */
function dispatch (action) {
    _logDetails(action);
    state = model(state, action);
    _logDetails();
}

/**
 * Generate a promise that resolves randomly between 1-3 seconds
  * @returns {Promise}
 * @private
 */
function _getFakePromise () {
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
function _getRandomDelayBetween (min, max, roundTo) {
    return Number(Math.random() * (max - min) + min).toFixed(roundTo);
}

/**
 * Log Redux actions
 * @param action
 * @private
 */
function _logDetails (action) {
    if (action) {
        console.log(`${chalk.white.bgRed('  Prev State:')} 
        ${__toString(state)}`);
        console.log(`${chalk.white.bgBlue('      Action:')} 
        ${__toString(action)}`);
    } else {
        console.log(`${chalk.white.bgGreen('  Next State:')}
        ${__toString(state)}`);
        console.log('\n');
    }
}

/**
 * Format objects to a JSON string, and indent with 2 spaces
 * @param obj
 * @private
 */
function __toString (obj) {
    return JSON.stringify(obj, null);
}
