"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ACTION_TYPES = exports.INITIAL_ENTITY_STATE = exports.ENTITY_PROPS = exports.ACTION_PROPS = exports.PROCESSOR_STAGE = void 0;
const PROCESSOR_STAGE = {
  BEFORE_SUCCESS: 'beforeSuccess',
  AFTER_SUCCESS: 'afterSuccess',
  BEFORE_FAILURE: 'beforeFailure',
  AFTER_FAILURE: 'afterFailure'
};
exports.PROCESSOR_STAGE = PROCESSOR_STAGE;
const ACTION_PROPS = {
  ENTITY: 'entity',
  APPEND: 'append'
};
exports.ACTION_PROPS = ACTION_PROPS;
const ENTITY_PROPS = {
  DATA: 'data',
  IS_FETCHING: 'isFetching',
  LAST_UPDATED: 'lastUpdated',
  ERROR: 'error'
};
exports.ENTITY_PROPS = ENTITY_PROPS;
const INITIAL_ENTITY_STATE = {
  isFetching: false,
  lastUpdated: null,
  data: null,
  error: null
};
exports.INITIAL_ENTITY_STATE = INITIAL_ENTITY_STATE;
const ACTION_TYPES = {
  FETCH_REQUEST: 'FETCH_REQUEST',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAILURE: 'FETCH_FAILURE',
  RESET_ENTITY: 'RESET_ENTITY',
  DELETE_ENTITY: 'DELETE_ENTITY'
};
exports.ACTION_TYPES = ACTION_TYPES;