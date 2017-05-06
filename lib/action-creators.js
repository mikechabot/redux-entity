'use strict';

var _require = require('./common/action-creators'),
    makeActionCreator = _require.makeActionCreator,
    makeEntityActionCreator = _require.makeEntityActionCreator;

var _require2 = require('./common/entity-const'),
    ACTION_TYPES = _require2.ACTION_TYPES,
    ENTITY_PROPS = _require2.ENTITY_PROPS,
    ACTION_PROPS = _require2.ACTION_PROPS;

module.exports = {
    resetEntity: makeActionCreator(ACTION_TYPES.RESET_ENTITY, ACTION_PROPS.ENTITY, ENTITY_PROPS.LAST_UPDATED),
    deleteEntity: makeActionCreator(ACTION_TYPES.DELETE_ENTITY, ACTION_PROPS.ENTITY),
    makeActionCreator: makeActionCreator,
    makeEntityActionCreator: makeEntityActionCreator,
    /**
     * Action creator for fetch requests
     * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
     * @return {function}           Action creator
     */
    fetchRequest: function fetchRequest(entity) {
        return makeEntityActionCreator(ACTION_TYPES.FETCH_REQUEST, entity);
    },
    /**
     * Action creator for API fetch successes
     * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
     * @return {function}           Action creator
     */
    fetchSuccess: function fetchSuccess(entity) {
        return makeEntityActionCreator(ACTION_TYPES.FETCH_SUCCESS, entity, ENTITY_PROPS.DATA, ENTITY_PROPS.LAST_UPDATED, ACTION_PROPS.APPEND);
    },
    /**
     * Action creator for API fetch failures
     * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
     * @return {function}           Action creator
     */
    fetchFailure: function fetchFailure(entity) {
        return makeEntityActionCreator(ACTION_TYPES.FETCH_FAILURE, entity, ENTITY_PROPS.ERROR, ENTITY_PROPS.LAST_UPDATED);
    }
};