'use strict';

const ACTION = require('./action-type');

/**
 * Generate action creators based on input arguments. The first argument is always
 * treated as the Redux action type; all other passed arguments are treated
 * as property on the action object itself.
 *
 *   Example: const myActionType = 'DO_IT';
 *            const doItAction = makeActionCreator(myActionType, 'data');
 *            doItAction(123); --> { type: "DO_IT", data: 123 }
 *
 * @param type
 * @returns {Function}
 */
function makeActionCreator(type) {
    if (!type) throw new Error('Type cannot be null/undefined');
    const keys = _getArgumentKeysAtIndex(arguments, 1);
    return function() {
        return _generateAction({ type }, keys, arguments);
    }
}

/**
 * Identical to makeActionCreator(), however this function expects the second
 * argument to be the name of an entity.
 * @param type              Redux action type
 * @param entity            Model entity name (e.g 'users', 'orders', 'foobar')
 * @returns {Function}      Action creator that contains an entity key
 */
function makeEntityActionCreator(type, entity) {
    if (!type) throw new Error('Type cannot be null/undefined');
    if (!entity) throw new Error('Entity cannot be null/undefined');
    const keys = _getArgumentKeysAtIndex(arguments, 2);
    return function() {
        return _generateAction({ type, entity }, keys, arguments);
    }
}

/**
 * Build an array of Strings using argument keys
 * @param args
 * @param index
 * @returns {Array}
 * @private
 */
function _getArgumentKeysAtIndex(args, index) {
    let keys = [];
    for (let i=index; i < args.length; i++) {
        keys.push(args[i]);
    }
    return keys;
}

/**
 * Generation a Redux action object
 * @param action
 * @param keys
 * @param args
 * @returns {*}
 * @private
 */
function _generateAction(action, keys, args) {
    keys.forEach((arg, index) => {
        action[keys[index]] = args[index]
    });
    return action;
}

module.exports = {
    resetEntity: makeActionCreator(ACTION.RESET_ENTITY, 'entity', 'lastUpdated'),
    deleteEntity: makeActionCreator(ACTION.DELETE_ENTITY, 'entity'),
    makeActionCreator: makeActionCreator,
    makeEntityActionCreator: makeEntityActionCreator,
    /**
     * Action creator for fetch requests
     * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
     * @return {function}           Action creator
     */
    fetchRequest: (entity) => {
        return makeEntityActionCreator(
            ACTION.FETCH_REQUEST,
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
            ACTION.FETCH_SUCCESS,
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
            ACTION.FETCH_FAILURE,
            entity,
            'error',
            'lastUpdated'
        );
    }
};