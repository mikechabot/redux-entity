'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.DeleteEntity = exports.ResetEntity = exports.fetchFailureCreator = exports.fetchSuccessCreator = exports.fetchRequestCreator = exports.makeEntityActionCreator = exports.makeActionCreator = void 0;

var _types = require('./types');

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly)
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    keys.push.apply(keys, symbols);
  }
  return keys;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}

var ENTITY = 'entity';
/**
 * Generate a Redux action object
 * @param action
 * @param keys
 * @param values
 */

var generateAction = function generateAction(action, keys, values) {
  var generatedAction = _objectSpread({}, action);

  if (keys && keys.length > 0) {
    var payload = {};
    keys.forEach(function (arg, index) {
      payload[keys[index]] = values[index];
    });
    generatedAction.payload = payload;
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

var makeActionCreator = function makeActionCreator(type) {
  for (var _len = arguments.length, keys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    keys[_key - 1] = arguments[_key];
  }

  if (!type) throw new Error('Type cannot be null/undefined');
  return function () {
    for (var _len2 = arguments.length, values = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      values[_key2] = arguments[_key2];
    }

    return generateAction(
      {
        type: type,
      },
      keys,
      values
    );
  };
};
/**
 * Identical to makeActionCreator(), however this function expects the second
 * argument to be the name of an entity.
 * @param type    Redux action type
 * @param entity  Model entity name (e.g 'users', 'orders', 'foobar')
 * @param keys    Additional keys to append to the payload
 */

exports.makeActionCreator = makeActionCreator;

var makeEntityActionCreator = function makeEntityActionCreator(type, entity) {
  for (var _len3 = arguments.length, keys = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
    keys[_key3 - 2] = arguments[_key3];
  }

  if (!type) throw new Error('Type cannot be null/undefined');
  if (!entity) throw new Error('Entity cannot be null/undefined');
  return function () {
    for (var _len4 = arguments.length, values = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      values[_key4] = arguments[_key4];
    }

    return generateAction(
      {
        type: type,
        entity: entity,
      },
      keys,
      values
    );
  };
};
/**
 * Action creator for fetch requests
 * @param  {string} entity  Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}       Action creator
 */

exports.makeEntityActionCreator = makeEntityActionCreator;

var fetchRequestCreator = function fetchRequestCreator(entity) {
  return makeEntityActionCreator(_types.EntityActionType.Request, entity);
};
/**
 * Action creator for API fetch successes
 * @param  {string} entity  Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}       Action creator
 */

exports.fetchRequestCreator = fetchRequestCreator;

var fetchSuccessCreator = function fetchSuccessCreator(entity) {
  return makeEntityActionCreator(
    _types.EntityActionType.Success,
    entity,
    _types.PayloadKey.Data,
    _types.PayloadKey.LastUpdated,
    _types.PayloadKey.Append
  );
};
/**
 * Action creator for API fetch failures
 * @param  {string} entity  Entity name (e.g. 'users', 'orders', 'foobar')
 * @return {function}       Action creator
 */

exports.fetchSuccessCreator = fetchSuccessCreator;

var fetchFailureCreator = function fetchFailureCreator(entity) {
  return makeEntityActionCreator(
    _types.EntityActionType.Failure,
    entity,
    _types.PayloadKey.Error,
    _types.PayloadKey.LastUpdated
  );
};

exports.fetchFailureCreator = fetchFailureCreator;

var ResetEntity = function ResetEntity(entity) {
  var lastUpdated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  return makeEntityActionCreator(_types.EntityActionType.Reset, entity, _types.PayloadKey.LastUpdated);
};

exports.ResetEntity = ResetEntity;

var DeleteEntity = function DeleteEntity(entity) {
  return makeEntityActionCreator(_types.EntityActionType.Delete, entity);
};

exports.DeleteEntity = DeleteEntity;
