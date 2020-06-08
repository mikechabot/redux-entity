'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.DeleteEntity = exports.ResetEntity = exports.fetchFailureCreator = exports.fetchSuccessCreator = exports.fetchRequestCreator = exports.makeEntityActionCreator = exports.makeActionCreator = void 0;
var types_1 = require('./types');
var ENTITY = 'entity';
/**
 * Generate a Redux action object
 * @param action
 * @param keys
 * @param values
 */
var generateAction = function (action, keys, values) {
  var generatedAction = __assign({}, action);
  if (keys && keys.length > 0) {
    var payload_1 = {};
    keys.forEach(function (arg, index) {
      payload_1[keys[index]] = values[index];
    });
    generatedAction.payload = payload_1;
  }
  return generatedAction;
};
/**
 * Generate action creators based on input arguments. The first argument is always
 * treated as the Redux action type; all other passed arguments are treated
 * as property on the action object itself.
 *
 *   Example: const type = 'DO_IT';
 *            const action = makeActionCreator(type, 'data');
 *            action(123); --> { type, data: 123 }
 *
 * @param type  Redux action type
 * @param keys  Additional keys to append to the payload
 */
exports.makeActionCreator = function (type) {
  var keys = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    keys[_i - 1] = arguments[_i];
  }
  if (!type) throw new Error('Type cannot be null/undefined');
  return function () {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      values[_i] = arguments[_i];
    }
    return generateAction({ type: type }, keys, values);
  };
};
/**
 * Identical to makeActionCreator(), however this function expects the second
 * argument to be the name of an entity.
 * @param type    Redux action type
 * @param entity  Model entity name (e.g 'users', 'orders', 'foobar')
 * @param keys    Additional keys to append to the payload
 */
exports.makeEntityActionCreator = function (type, entity) {
  var keys = [];
  for (var _i = 2; _i < arguments.length; _i++) {
    keys[_i - 2] = arguments[_i];
  }
  if (!type) throw new Error('Type cannot be null/undefined');
  if (!entity) throw new Error('Entity cannot be null/undefined');
  return function () {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      values[_i] = arguments[_i];
    }
    return generateAction({ type: type, entity: entity }, keys, values);
  };
};
/**
 * Action creator for fetch requests
 * @param  {string} entity  Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}       Action creator
 */
exports.fetchRequestCreator = function (entity) {
  return exports.makeEntityActionCreator(types_1.EntityActionType.Request, entity);
};
/**
 * Action creator for API fetch successes
 * @param  {string} entity  Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}       Action creator
 */
exports.fetchSuccessCreator = function (entity) {
  return exports.makeEntityActionCreator(
    types_1.EntityActionType.Success,
    entity,
    types_1.PayloadKey.Data,
    types_1.PayloadKey.LastUpdated,
    types_1.PayloadKey.Append
  );
};
/**
 * Action creator for API fetch failures
 * @param  {string} entity  Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}       Action creator
 */
exports.fetchFailureCreator = function (entity) {
  return exports.makeEntityActionCreator(
    types_1.EntityActionType.Failure,
    entity,
    types_1.PayloadKey.Error,
    types_1.PayloadKey.LastUpdated
  );
};
exports.ResetEntity = exports.makeEntityActionCreator(
  types_1.EntityActionType.Reset,
  ENTITY,
  types_1.PayloadKey.LastUpdated
);
exports.DeleteEntity = exports.makeEntityActionCreator(types_1.EntityActionType.Delete, ENTITY);
