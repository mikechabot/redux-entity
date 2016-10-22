'use strict';

const ACTION_TYPES = require('./action-types');
const {
    FETCH_REQUEST,
    FETCH_SUCCESS,
    FETCH_FAILURE,
    RESET_ENTITY,
    DELETE_ENTITY
} = ACTION_TYPES;

module.exports = function model(state = {}, action) {
    switch(action.type) {
        case RESET_ENTITY:  // fall through
        case FETCH_SUCCESS: // fall through
        case FETCH_FAILURE: // fall through
        case FETCH_REQUEST: {
            state[action.entity] = entity(
                state[action.entity],
                action
            );
            return Object.assign({}, state);
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

const INITIAL_ENTITY_STATE = {
    isFetching: false,
    lastUpdated: undefined,
    data: {}
};

function entity(state = INITIAL_ENTITY_STATE, action) {
    switch(action.type) {
        case FETCH_REQUEST: {
            state.isFetching = true;
            state.error = undefined;
            return Object.assign({}, state);
        }
        case FETCH_SUCCESS: {
            state.isFetching = false;
            state.lastUpdated = action.lastUpdated;
            state.data = action.data;
            state.error = undefined;
            return Object.assign({}, state);
        }
        case FETCH_FAILURE: {
            state.isFetching = false;
            state.lastUpdated = action.lastUpdated;
            state.data = undefined;
            state.error = action.error;
            return Object.assign({}, state);
        }
        case RESET_ENTITY: {
            state = INITIAL_ENTITY_STATE;
            state.lastUpdated = action.lastUpdated;
            return Object.assign({}, state);
        }
        default: {
            return state;
        }
    }
}