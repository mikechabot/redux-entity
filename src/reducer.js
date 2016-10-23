'use strict';

const {
    FETCH_REQUEST,
    FETCH_SUCCESS,
    FETCH_FAILURE,
    RESET_ENTITY,
    DELETE_ENTITY
} = require('./common/action-types');

const INITIAL_STATE = {};
const INITIAL_ENTITY_STATE = {
    isFetching  : false,
    lastUpdated : undefined,
    data        : {}
};

module.exports = function model(state = INITIAL_STATE, action) {
    switch(action.type) {
        case RESET_ENTITY:  // fall through
        case FETCH_SUCCESS: // fall through
        case FETCH_FAILURE: // fall through
        case FETCH_REQUEST: {
            return Object.assign({}, state, {
                [action.entity]: entity(
                    state[action.entity],
                    action
                )
            });
        }
        case DELETE_ENTITY: {
            delete state[action.entity];
            return Object.assign({}, state);
        }
        default: {
            return state;
        }
    }
};

function entity(state = INITIAL_ENTITY_STATE, action) {
    switch(action.type) {
        case FETCH_REQUEST: {
            return Object.assign({}, state, {
                isFetching: true,
                error: null
            });
        }
        case FETCH_SUCCESS: {
            return Object.assign({}, state, {
                isFetching: false,
                lastUpdated: action.lastUpdated,
                data: action.data,
                error: null
            });
        }
        case FETCH_FAILURE: {
            return Object.assign({}, state, {
                isFetching: false,
                lastUpdated: action.lastUpdated,
                data: null,
                error: action.error
            });
        }
        case RESET_ENTITY: {
            return Object.assign({}, INITIAL_ENTITY_STATE, {
                lastUpdated: action.lastUpdated
            });
        }
        default: {
            return state;
        }
    }
}