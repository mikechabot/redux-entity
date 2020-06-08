'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = entities;

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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
  throw new TypeError(
    'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === 'string') return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === 'Object' && o.constructor) n = o.constructor.name;
  if (n === 'Map' || n === 'Set') return Array.from(o);
  if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

var INITIAL_ENTITY_STATE = {
  data: undefined,
  lastUpdated: undefined,
  isFetching: false,
  error: undefined,
};
var INITIAL_STATE = {};

function toArray(obj) {
  return Array.isArray(obj) ? obj : [obj];
}

function deriveNewData(stateData, payload) {
  var data = payload.data,
    append = payload.append;

  if (!append) {
    return data;
  }

  var newData = toArray(data);
  return !stateData ? newData : [].concat(_toConsumableArray(stateData), _toConsumableArray(newData));
}
/**
 * Sub-reducer responsible for managing individual entities
 * @param state
 * @param action
 */

function entityReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_ENTITY_STATE;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
    payload = action.payload;

  switch (type) {
    case _types.EntityActionType.REQUEST: {
      return _objectSpread(
        _objectSpread({}, state),
        {},
        {
          isFetching: true,
          error: null,
        }
      );
    }

    case _types.EntityActionType.SUCCESS: {
      var newData = deriveNewData(state.data, payload);
      return _objectSpread(
        _objectSpread({}, state),
        {},
        {
          isFetching: false,
          lastUpdated: payload.lastUpdated,
          data: newData,
          error: null,
        }
      );
    }

    case _types.EntityActionType.FAILURE: {
      return _objectSpread(
        _objectSpread({}, state),
        {},
        {
          isFetching: false,
          lastUpdated: payload.lastUpdated,
          data: null,
          error: payload.error,
        }
      );
    }

    case _types.EntityActionType.RESET: {
      return _objectSpread(
        _objectSpread({}, INITIAL_ENTITY_STATE),
        {},
        {
          lastUpdated: payload.lastUpdated,
        }
      );
    }

    default: {
      return state;
    }
  }
}
/**
 * Root reducer responsible for managing multiple entities
 * @param state
 * @param action
 */

function entities() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var type = action.type,
    entity = action.entity;

  switch (type) {
    case _types.EntityActionType.RESET: // fall through

    case _types.EntityActionType.SUCCESS: // fall through

    case _types.EntityActionType.FAILURE: // fall through

    case _types.EntityActionType.REQUEST: {
      return _objectSpread(
        _objectSpread({}, state),
        {},
        _defineProperty({}, entity, entityReducer(state[entity], action))
      );
    }

    case _types.EntityActionType.DELETE: {
      var newState = _objectSpread({}, state);

      delete newState[entity];
      return newState;
    }

    default: {
      return state;
    }
  }
}
