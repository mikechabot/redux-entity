'use strict';

const ACTION_TYPE = require('./common/action-type');

const INITIAL_ENTITY_STATE = {
    isFetching  : false,
    lastUpdated : undefined,
    data        : {}
};

module.exports = function model(state, action) {
    switch(action.type) {
        case ACTION_TYPE.RESET_ENTITY:  // fall through
        case ACTION_TYPE.FETCH_SUCCESS: // fall through
        case ACTION_TYPE.FETCH_FAILURE: // fall through
        case ACTION_TYPE.FETCH_REQUEST: {
            return Object.assign({}, state, {
                [action.entity]: entity(
                    state[action.entity],
                    action
                )
            });
        }
        case ACTION_TYPE.DELETE_ENTITY: {
            delete state[action.entity];
            return Object.assign({}, state);
        }
        default: {
            return state;
        }
    }
};

function entity(state, action) {
    switch(action.type) {
        case ACTION_TYPE.FETCH_REQUEST: {
            return Object.assign({}, state, {
                isFetching: true,
                error: null
            });
        }
        case ACTION_TYPE.FETCH_SUCCESS: {
            return Object.assign({}, state, {
                isFetching: false,
                lastUpdated: action.lastUpdated,
                data: action.data,
                error: null
            });
        }
        case ACTION_TYPE.FETCH_FAILURE: {
            return Object.assign({}, state, {
                isFetching: false,
                lastUpdated: action.lastUpdated,
                data: null,
                error: action.error
            });
        }
        case ACTION_TYPE.RESET_ENTITY: {
            return Object.assign({}, INITIAL_ENTITY_STATE, {
                lastUpdated: action.lastUpdated
            });
        }
        default: {
            return state;
        }
    }
}