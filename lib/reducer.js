"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = entities;

var _entityConst = require("./common/entity-const");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function toArray(obj) {
  return Array.isArray(obj) ? obj : [obj];
}

function entity() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _entityConst.INITIAL_ENTITY_STATE;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _entityConst.ACTION_TYPES.FETCH_REQUEST:
      {
        return Object.assign({}, state, {
          isFetching: true,
          error: null
        });
      }

    case _entityConst.ACTION_TYPES.FETCH_SUCCESS:
      {
        var newData;

        if (action.append !== true) {
          newData = action.data;
        } else if (!state.data) {
          newData = toArray(action.data);
        } else {
          newData = state.data.concat(toArray(action.data));
        }

        return Object.assign({}, state, {
          isFetching: false,
          lastUpdated: action.lastUpdated,
          data: newData,
          error: null
        });
      }

    case _entityConst.ACTION_TYPES.FETCH_FAILURE:
      {
        return Object.assign({}, state, {
          isFetching: false,
          lastUpdated: action.lastUpdated,
          data: null,
          error: action.error
        });
      }

    case _entityConst.ACTION_TYPES.RESET_ENTITY:
      {
        return Object.assign({}, _entityConst.INITIAL_ENTITY_STATE, {
          lastUpdated: action.lastUpdated
        });
      }

    default:
      {
        return state;
      }
  }
}

function entities() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _entityConst.ACTION_TYPES.RESET_ENTITY: // fall through

    case _entityConst.ACTION_TYPES.FETCH_SUCCESS: // fall through

    case _entityConst.ACTION_TYPES.FETCH_FAILURE: // fall through

    case _entityConst.ACTION_TYPES.FETCH_REQUEST:
      {
        return Object.assign({}, state, _defineProperty({}, action.entity, entity(state[action.entity], action)));
      }

    case _entityConst.ACTION_TYPES.DELETE_ENTITY:
      {
        var newState = Object.assign({}, state);
        delete newState[action.entity];
        return newState;
      }

    default:
      {
        return state;
      }
  }
}