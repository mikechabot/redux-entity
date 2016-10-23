'use strict';

/**
 * NOTE: Run me on Node 6+!
 */

const loadEntity = require('./index').loadEntity;
const reducer = require('./index').reducer;

// Simulate Redux (with a logger)
let state = {};
function dispatch(action) {
    _logDetails(action);
    state = reducer(state, action);
    _logDetails();
}

fetchFoobar()(dispatch);

/**
 * Custom thunk that utilizes "loadEntity". Export this thunk,
 * and connect() it to your Components with redux-thunk.
 *
 *    'foobar'          The name of our fake entity. This will be stored in
 *                      redux as "state.model.foobar". All entities you load
 *                      with "loadEntity" will be stored on "state.model" using
 *                      the entity name you choose.
 *    'fakePromise()'   Promise that loads data from an external source
 *
 *
 * @param entityName
 * @returns {*}
 */
function fetchFoobar() {
    return loadEntity(
        'foobar',
        fakePromise()
    );
}

function fakePromise() {
    return new Promise((resolve) => {
        const delay = _getShortDelay();
        setTimeout(() => resolve({delay}), delay * 1000);
    });
}

function _getShortDelay() {
    return _getRandomDelayBetween(1, 3, 2);
}

function _getRandomDelayBetween(min, max, roundTo) {
    return Number(Math.random() * (max - min) + min).toFixed(roundTo);
}

function _logDetails(action) {
    if (action) {
        console.log(`PREV STATE: ${_format(state)}`);
        console.log(`    ACTION: ${_format(action)}`);
    } else {
        console.log(`NEXT STATE: ${_format(state)}`);
    }
}

function _format(obj) {
    return JSON.stringify(obj, null, 2)
}