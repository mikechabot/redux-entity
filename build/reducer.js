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
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];
    return r;
  };
Object.defineProperty(exports, '__esModule', { value: true });
var types_1 = require('./types');
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
  return !stateData ? newData : __spreadArrays(stateData, newData);
}
/**
 * Sub-reducer responsible for managing individual entities
 * @param state
 * @param action
 */
function entityReducer(state, action) {
  if (state === void 0) {
    state = INITIAL_ENTITY_STATE;
  }
  var type = action.type,
    payload = action.payload;
  switch (type) {
    case types_1.EntityActionType.Request: {
      return __assign(__assign({}, state), { isFetching: true, error: null });
    }
    case types_1.EntityActionType.Success: {
      var newData = deriveNewData(state.data, payload);
      return __assign(__assign({}, state), {
        isFetching: false,
        lastUpdated: payload.lastUpdated,
        data: newData,
        error: null,
      });
    }
    case types_1.EntityActionType.Failure: {
      return __assign(__assign({}, state), {
        isFetching: false,
        lastUpdated: payload.lastUpdated,
        data: null,
        error: payload.error,
      });
    }
    case types_1.EntityActionType.Reset: {
      return __assign(__assign({}, INITIAL_ENTITY_STATE), { lastUpdated: payload.lastUpdated });
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
function entities(state, action) {
  var _a;
  if (state === void 0) {
    state = INITIAL_STATE;
  }
  var type = action.type,
    entity = action.entity;
  switch (type) {
    case types_1.EntityActionType.Reset: // fall through
    case types_1.EntityActionType.Success: // fall through
    case types_1.EntityActionType.Failure: // fall through
    case types_1.EntityActionType.Request: {
      return __assign(__assign({}, state), ((_a = {}), (_a[entity] = entityReducer(state[entity], action)), _a));
    }
    case types_1.EntityActionType.Delete: {
      var newState = __assign({}, state);
      delete newState[entity];
      return newState;
    }
    default: {
      return state;
    }
  }
}
exports.default = entities;
