import {
    FETCH_REQUEST,
    FETCH_SUCCESS,
    FETCH_FAILURE,
    RESET_ENTITY,
    UPDATE_ENTITY,
    DELETE_ENTITY,
} from '../action-types';

export const resetEntity = makeActionCreator(RESET_ENTITY, 'entity', 'lastUpdated');
export const deleteEntity = makeActionCreator(DELETE_ENTITY, 'entity');

/**
 * To reduce boilerplate code, we can utilize generic function to generate
 * action creators based on input arguments. The first argument is always
 * treated as the Redux action type; all other passed arguments are treated
 * as property on the action object itself.
 *
 *   Example: const myActionType = 'DO_IT';
 *            const doItAction = makeActionCreator(myActionType, 'data');
 *            doItAction(123); --> { type: "DO_IT", data: 123 }
 */
export function makeActionCreator(type, ...keys) {
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
export function makeEntityActionCreator(type, entity, ...keys) {
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

/**
 * Action creator for fetch requests
 * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}           Action creator
 */
export const fetchRequest = (entity) => {
    return makeEntityActionCreator(
        FETCH_REQUEST,
        entity
    );
};

/**
 * Action creator for API fetch successes
 * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}           Action creator
 */
export const fetchSuccess = (entity) => {
    return makeEntityActionCreator(
        FETCH_SUCCESS,
        entity,
        'data',
        'lastUpdated'
    );
};

/**
 * Action creator for API fetch failures
 * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}           Action creator
 */
export const fetchFailure = (entity) => {
    return makeEntityActionCreator(
        FETCH_FAILURE,
        entity,
        'error',
        'lastUpdated'
    );
};