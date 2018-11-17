"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _actionCreators = require("./common/action-creators");

var _entityConst = require("./common/entity-const");

const actionCreators = {
  resetEntity: (0, _actionCreators.makeActionCreator)(_entityConst.ACTION_TYPES.RESET_ENTITY, _entityConst.ACTION_PROPS.ENTITY, _entityConst.ENTITY_PROPS.LAST_UPDATED),
  deleteEntity: (0, _actionCreators.makeActionCreator)(_entityConst.ACTION_TYPES.DELETE_ENTITY, _entityConst.ACTION_PROPS.ENTITY),

  /**
   * Action creator for fetch requests
   * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
   * @return {function}           Action creator
   */
  fetchRequest: entity => (0, _actionCreators.makeEntityActionCreator)(_entityConst.ACTION_TYPES.FETCH_REQUEST, entity),

  /**
   * Action creator for API fetch successes
   * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
   * @return {function}           Action creator
   */
  fetchSuccess: entity => (0, _actionCreators.makeEntityActionCreator)(_entityConst.ACTION_TYPES.FETCH_SUCCESS, entity, _entityConst.ENTITY_PROPS.DATA, _entityConst.ENTITY_PROPS.LAST_UPDATED, _entityConst.ACTION_PROPS.APPEND),

  /**
   * Action creator for API fetch failures
   * @param  {string} entity      Entity name (e.g. 'users', 'orders', 'foobar')
   * @return {function}           Action creator
   */
  fetchFailure: entity => (0, _actionCreators.makeEntityActionCreator)(_entityConst.ACTION_TYPES.FETCH_FAILURE, entity, _entityConst.ENTITY_PROPS.ERROR, _entityConst.ENTITY_PROPS.LAST_UPDATED)
};
var _default = actionCreators;
exports.default = _default;