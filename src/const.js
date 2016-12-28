'use strict';

const STAGES = {
    BEFORE_SUCCESS: 'beforeSuccess',
    AFTER_SUCCESS : 'afterSuccess',
    BEFORE_FAILURE: 'beforeFailure',
    AFTER_FAILURE : 'afterFailure'
};

module.exports = {
    INITIAL_MODEL_STATE : {},
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
    STAGES         : STAGES,
    DEFAULT_OPTIONS: {
        silent    : false,
        append    : false,
        processors: {
            [STAGES.BEFORE_SUCCESS]: null,
            [STAGES.AFTER_SUCCESS] : null,
            [STAGES.BEFORE_FAILURE]: null,
            [STAGES.AFTER_FAILURE] : null
        }
    }
};
