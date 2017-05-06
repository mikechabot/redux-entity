'use strict';

const PROCESSOR_STAGE = {
    BEFORE_SUCCESS: 'beforeSuccess',
    AFTER_SUCCESS : 'afterSuccess',
    BEFORE_FAILURE: 'beforeFailure',
    AFTER_FAILURE : 'afterFailure'
};

module.exports = {
    ACTION_PROPS: {
        ENTITY: 'entity',
        APPEND: 'append'
    },
    ENTITY_PROPS: {
        DATA        : 'data',
        IS_FETCHING : 'isFetching',
        LAST_UPDATED: 'lastUpdated',
        ERROR       : 'error'
    },
    INITIAL_ENTITY_STATE: {
        isFetching : false,
        lastUpdated: null,
        data       : null,
        error      : null
    },
    ACTION_TYPES: {
        FETCH_REQUEST: 'FETCH_REQUEST',
        FETCH_SUCCESS: 'FETCH_SUCCESS',
        FETCH_FAILURE: 'FETCH_FAILURE',
        RESET_ENTITY : 'RESET_ENTITY',
        DELETE_ENTITY: 'DELETE_ENTITY'
    },
    PROCESSOR_STAGE: PROCESSOR_STAGE,
    DEFAULT_OPTIONS: {
        silent    : false,
        append    : false,
        processors: {
            [PROCESSOR_STAGE.BEFORE_SUCCESS]: null,
            [PROCESSOR_STAGE.AFTER_SUCCESS] : null,
            [PROCESSOR_STAGE.BEFORE_FAILURE]: null,
            [PROCESSOR_STAGE.AFTER_FAILURE] : null
        }
    }
};
