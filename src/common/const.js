module.exports = {
    INITIAL_STATE       : {},
    INITIAL_ENTITY_STATE: {
        isFetching : false,
        lastUpdated: undefined,
        data       : null
    },
    DEFAULT_OPTIONS: {
        silent: false,
        append: false
    },
    ACTION_TYPES: {
        FETCH_REQUEST: 'FETCH_REQUEST',
        FETCH_SUCCESS: 'FETCH_SUCCESS',
        FETCH_FAILURE: 'FETCH_FAILURE',
        RESET_ENTITY : 'RESET_ENTITY',
        DELETE_ENTITY: 'DELETE_ENTITY'
    }
};
