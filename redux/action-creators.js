'use strict';

const ACTION_TYPES = require('./action-types');

/**
 * Generate action creators based on input arguments. The first argument is always
 * treated as the Redux action type; all other passed arguments are treated
 * as property on the action object itself.
 *
 *   Example: const myActionType = 'DO_IT';
 *            const doItAction = makeActionCreator(myActionType, 'data');
 *            doItAction(123); --> { type: "DO_IT", data: 123 }
 */
function makeActionCreator(type, ...keys) {
    if (!type) throw new Error('Type cannot be null/undefined');
    return function(...args) {
        let action = { type };
        keys.forEach((arg, index) => {
            action[keys[index]] = args[index]
        });
        return action;
    }
}

/**
 * Identical to makeActionCreator(), however this function expects the second
 * argument to be the name of an entity.
 *
 * @param  {string} type        Redux action type
 * @param  {string} entity      Model entity name (e.g 'users', 'orders', 'foobar')
 * @param  {string} ...keys     Keys to be used in the action object
 * @return {function}           Action creator that contains an entity key
 */
function makeEntityActionCreator(type, entity, ...keys) {
    if (!type) throw new Error('Type cannot be null/undefined');
    if (!entity) throw new Error('Entity cannot be null/undefined');
    return function(...args) {
        let action = { type, entity };
        keys.forEach((arg, index) => {
            action[keys[index]] = args[index]
        });
        return action;
    }
}

module.exports = {
    resetEntity: makeActionCreator(ACTION_TYPES.RESET_ENTITY, 'entity', 'lastUpdated'),
    deleteEntity: makeActionCreator(ACTION_TYPES.DELETE_ENTITY, 'entity'),
    /**
     * Action creator for fetch requests
     * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
     * @return {function}           Action creator
     */
    fetchRequest: (entity) => {
        return makeEntityActionCreator(
            ACTION_TYPES.FETCH_REQUEST,
            entity
        )
    },
    /**
     * Action creator for API fetch successes
     * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
     * @return {function}           Action creator
     */
    fetchSuccess: (entity) => {
        return makeEntityActionCreator(
            ACTION_TYPES.FETCH_SUCCESS,
            entity,
            'data',
            'lastUpdated'
        );
    },
    /**
     * Action creator for API fetch failures
     * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
     * @return {function}           Action creator
     */
    fetchFailure: (entity) => {
        return makeEntityActionCreator(
            ACTION_TYPES.FETCH_FAILURE,
            entity,
            'error',
            'lastUpdated'
        );
    }
};