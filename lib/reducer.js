"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = entities;

var _entityConst = require("./common/entity-const");

function toArray(obj) {
  return Array.isArray(obj) ? obj : [obj];
}

function entity() {
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _entityConst.INITIAL_ENTITY_STATE;
  let action = arguments.length > 1 ? arguments[1] : undefined;

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
        let newData;

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
  let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  let action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case _entityConst.ACTION_TYPES.RESET_ENTITY: // fall through

    case _entityConst.ACTION_TYPES.FETCH_SUCCESS: // fall through

    case _entityConst.ACTION_TYPES.FETCH_FAILURE: // fall through

    case _entityConst.ACTION_TYPES.FETCH_REQUEST:
      {
        return Object.assign({}, state, {
          [action.entity]: entity(state[action.entity], action)
        });
      }

    case _entityConst.ACTION_TYPES.DELETE_ENTITY:
      {
        const newState = Object.assign({}, state);
        delete newState[action.entity];
        return newState;
      }

    default:
      {
        return state;
      }
  }
}