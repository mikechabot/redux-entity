'use strict';

const { makeActionCreator, makeEntityActionCreator } = require('./common/action-creators');
const { ACTION_TYPES } = require('./common/entity-const');

module.exports = {
    resetEntity            : makeActionCreator(ACTION_TYPES.RESET_ENTITY, 'entity', 'lastUpdated'),
    deleteEntity           : makeActionCreator(ACTION_TYPES.DELETE_ENTITY, 'entity'),
    makeActionCreator      : makeActionCreator,
    makeEntityActionCreator: makeEntityActionCreator,
    /**
     * Action creator for fetch requests
     * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
     * @return {function}           Action creator
     */
    fetchRequest           : (entity) => {
        return makeEntityActionCreator(
            ACTION_TYPES.FETCH_REQUEST,
            entity
        );
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
            'lastUpdated',
            'append'
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
