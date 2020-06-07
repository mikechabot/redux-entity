/***
 *
 *  This example is executable at https://npm.runkit.com/redux-entity *
 *
 *  To run locally via "npm run example", uncomment the "./lib" require
 *  statements, and comment out the "redux-entity" require statements.
 */

const { entities, GetEntity } = require('./lib');

const chalk = require('chalk');

// Redux state
let state = {};

/**
 * Stub for Redux's dispatch function
 * @param action
 */
function dispatch(action) {
  _logDetails(action);
  state = entities(state, action);
  _logDetails();
}

/**
 * Stub for Redux's getState function
 * @returns {{}}
 */
function getState() {
  return state;
}

/**
 * Generate a promise that resolves randomly between 1-3 seconds
 * @returns {Promise}
 * @private
 */
function _getFakePromise() {
  return new Promise((resolve) => {
    const delay = Number(Math.random() * (2 - 1) + 1).toFixed(2);
    setTimeout(() => resolve({ delay }), delay * 1000);
  });
}

/**
 * Define custom thunk
 * @returns {*}
 */
function fetchFoobar() {
  return GetEntity('foobar', _getFakePromise(), null);
}

// Invoke your custom thunk
fetchFoobar()(dispatch, getState);

/**
 * Log Redux actions
 * @param action
 * @private
 */
function _logDetails(action) {
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
function __toString(obj) {
  return JSON.stringify(obj, null);
}
