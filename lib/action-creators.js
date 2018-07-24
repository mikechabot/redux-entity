'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchFailure = exports.fetchSuccess = exports.fetchRequest = exports.deleteEntity = exports.resetEntity = undefined;

var _actionCreators = require('./common/action-creators');

var _entityConst = require('./common/entity-const');

var resetEntity = exports.resetEntity = function resetEntity() {
  return (0, _actionCreators.makeActionCreator)(_entityConst.ACTION_TYPES.RESET_ENTITY, _entityConst.ACTION_PROPS.ENTITY, _entityConst.ENTITY_PROPS.LAST_UPDATED);
};

var deleteEntity = exports.deleteEntity = function deleteEntity() {
  return (0, _actionCreators.makeActionCreator)(_entityConst.ACTION_TYPES.DELETE_ENTITY, _entityConst.ACTION_PROPS.ENTITY);
};

/**
 * Action creator for fetch requests
 * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}           Action creator
 */
var fetchRequest = exports.fetchRequest = function fetchRequest(entity) {
  return (0, _actionCreators.makeEntityActionCreator)(_entityConst.ACTION_TYPES.FETCH_REQUEST, entity);
};

/**
 * Action creator for API fetch successes
 * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}           Action creator
 */
var fetchSuccess = exports.fetchSuccess = function fetchSuccess(entity) {
  return (0, _actionCreators.makeEntityActionCreator)(_entityConst.ACTION_TYPES.FETCH_SUCCESS, entity, _entityConst.ENTITY_PROPS.DATA, _entityConst.ENTITY_PROPS.LAST_UPDATED, _entityConst.ACTION_PROPS.APPEND);
};

/**
 * Action creator for API fetch failures
 * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}           Action creator
 */
var fetchFailure = exports.fetchFailure = function fetchFailure(entity) {
  return (0, _actionCreators.makeEntityActionCreator)(_entityConst.ACTION_TYPES.FETCH_FAILURE, entity, _entityConst.ENTITY_PROPS.ERROR, _entityConst.ENTITY_PROPS.LAST_UPDATED);
};