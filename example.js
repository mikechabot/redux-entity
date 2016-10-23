'use strict';

const loadEntity = require('./index').loadEntity;
const reducer = require('./index').reducer;

let state = {};
fetchEntity('foo')(dispatch);
fetchEntity('bar')(dispatch);

/**
 * Thunk action that simulates a delayed API call
 * @returns {Function}  thunk
 */
function fetchEntity(entityName) {
    return loadEntity(
        entityName,
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

function dispatch(action) {
    console.log('***************************************');
    console.log(`PREV STATE: ${JSON.stringify(state, null, 2)}`);
    console.log(`ACTION: ${JSON.stringify(action, null, 2)}`);
    state = reducer(state, action);
    console.log(`PREV STATE: ${JSON.stringify(state, null, 2)}`);
}