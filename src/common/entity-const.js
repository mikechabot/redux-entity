export const PROCESSOR_STAGE = {
  BEFORE_SUCCESS: 'beforeSuccess',
  AFTER_SUCCESS: 'afterSuccess',
  BEFORE_FAILURE: 'beforeFailure',
  AFTER_FAILURE: 'afterFailure'
};

export const ACTION_PROPS = {
  ENTITY: 'entity',
  APPEND: 'append'
};

export const ENTITY_PROPS = {
  DATA: 'data',
  IS_FETCHING: 'isFetching',
  LAST_UPDATED: 'lastUpdated',
  ERROR: 'error'
};

export const INITIAL_ENTITY_STATE = {
  isFetching: false,
  lastUpdated: null,
  data: null,
  error: null
};

export const ACTION_TYPES = {
  FETCH_REQUEST: 'FETCH_REQUEST',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAILURE: 'FETCH_FAILURE',
  RESET_ENTITY: 'RESET_ENTITY',
  DELETE_ENTITY: 'DELETE_ENTITY'
};
