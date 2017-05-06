'use strict';

var _processors;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PROCESSOR_STAGE = {
    BEFORE_SUCCESS: 'beforeSuccess',
    AFTER_SUCCESS: 'afterSuccess',
    BEFORE_FAILURE: 'beforeFailure',
    AFTER_FAILURE: 'afterFailure'
};

module.exports = {
    ACTION_PROPS: {
        ENTITY: 'entity',
        APPEND: 'append'
    },
    ENTITY_PROPS: {
        DATA: 'data',
        IS_FETCHING: 'isFetching',
        LAST_UPDATED: 'lastUpdated',
        ERROR: 'error'
    },
    INITIAL_ENTITY_STATE: {
        isFetching: false,
        lastUpdated: null,
        data: null,
        error: null
    },
    ACTION_TYPES: {
        FETCH_REQUEST: 'FETCH_REQUEST',
        FETCH_SUCCESS: 'FETCH_SUCCESS',
        FETCH_FAILURE: 'FETCH_FAILURE',
        RESET_ENTITY: 'RESET_ENTITY',
        DELETE_ENTITY: 'DELETE_ENTITY'
    },
    PROCESSOR_STAGE: PROCESSOR_STAGE,
    DEFAULT_OPTIONS: {
        silent: false,
        append: false,
        processors: (_processors = {}, _defineProperty(_processors, PROCESSOR_STAGE.BEFORE_SUCCESS, null), _defineProperty(_processors, PROCESSOR_STAGE.AFTER_SUCCESS, null), _defineProperty(_processors, PROCESSOR_STAGE.BEFORE_FAILURE, null), _defineProperty(_processors, PROCESSOR_STAGE.AFTER_FAILURE, null), _processors)
    }
};