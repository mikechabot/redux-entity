'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeActionCreator = makeActionCreator;
exports.makeEntityActionCreator = makeEntityActionCreator;
/**
 * Generation a Redux action object
 * @param action
 * @param keys
 * @param args
 * @returns {*}
 * @private
 */
var generateAction = function generateAction(action, keys, values) {
  var generatedAction = Object.assign({}, action);
  keys.forEach(function (arg, index) {
    generatedAction[keys[index]] = values[index];
  });
  return generatedAction;
};

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
  for (var _len = arguments.length, keys = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    keys[_key - 1] = arguments[_key];
  }

  if (!type) throw new Error('Type cannot be null/undefined');
  return function () {
    for (var _len2 = arguments.length, values = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      values[_key2] = arguments[_key2];
    }

    return generateAction({ type: type }, keys, values);
  };
}

/**
 * Identical to makeActionCreator(), however this function expects the second
 * argument to be the name of an entity.
 * @param type              Redux action type
 * @param entity            Model entity name (e.g 'users', 'orders', 'foobar')
 * @returns {Function}      Action creator that contains an entity key
 */
function makeEntityActionCreator(type, entity) {
  for (var _len3 = arguments.length, keys = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    keys[_key3 - 2] = arguments[_key3];
  }

  if (!type) throw new Error('Type cannot be null/undefined');
  if (!entity) throw new Error('Entity cannot be null/undefined');
  return function () {
    for (var _len4 = arguments.length, values = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      values[_key4] = arguments[_key4];
    }

    return generateAction({ type: type, entity: entity }, keys, values);
  };
}