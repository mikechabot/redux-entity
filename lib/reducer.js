'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CONST = require('./common/entity-const');
var ACTION_TYPES = CONST.ACTION_TYPES;


module.exports = function entities(state, action) {
    if (!state) state = {};
    switch (action.type) {
        case ACTION_TYPES.RESET_ENTITY: // fall through
        case ACTION_TYPES.FETCH_SUCCESS: // fall through
        case ACTION_TYPES.FETCH_FAILURE: // fall through
        case ACTION_TYPES.FETCH_REQUEST:
            {
                return Object.assign({}, state, _defineProperty({}, action.entity, entity(state[action.entity], action)));
            }
        case ACTION_TYPES.DELETE_ENTITY:
            {
                delete state[action.entity];
                return Object.assign({}, state);
            }
        default:
            {
                return state;
            }
    }
};

function entity(state, action) {
    if (!state) state = Object.assign({}, CONST.INITIAL_ENTITY_STATE);
    switch (action.type) {
        case ACTION_TYPES.FETCH_REQUEST:
            {
                return Object.assign({}, state, {
                    isFetching: true,
                    error: null
                });
            }
        case ACTION_TYPES.FETCH_SUCCESS:
            {
                return Object.assign({}, state, {
                    isFetching: false,
                    lastUpdated: action.lastUpdated,
                    data: action.append ? !state.data ? __toArray(action.data) : state.data.concat(__toArray(action.data)) : action.data,
                    error: null
                });
            }
        case ACTION_TYPES.FETCH_FAILURE:
            {
                return Object.assign({}, state, {
                    isFetching: false,
                    lastUpdated: action.lastUpdated,
                    data: null,
                    error: action.error
                });
            }
        case ACTION_TYPES.RESET_ENTITY:
            {
                return Object.assign({}, CONST.INITIAL_ENTITY_STATE, {
                    lastUpdated: action.lastUpdated
                });
            }
    }
}
function __toArray(obj) {
    return Array.isArray(obj) ? obj : [obj];
}