'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var PROCESSOR_STAGE = exports.PROCESSOR_STAGE = {
  BEFORE_SUCCESS: 'beforeSuccess',
  AFTER_SUCCESS: 'afterSuccess',
  BEFORE_FAILURE: 'beforeFailure',
  AFTER_FAILURE: 'afterFailure'
};

var ACTION_PROPS = exports.ACTION_PROPS = {
  ENTITY: 'entity',
  APPEND: 'append'
};

var ENTITY_PROPS = exports.ENTITY_PROPS = {
  DATA: 'data',
  IS_FETCHING: 'isFetching',
  LAST_UPDATED: 'lastUpdated',
  ERROR: 'error'
};

var INITIAL_ENTITY_STATE = exports.INITIAL_ENTITY_STATE = {
  isFetching: false,
  lastUpdated: null,
  data: null,
  error: null
};

var ACTION_TYPES = exports.ACTION_TYPES = {
  FETCH_REQUEST: 'FETCH_REQUEST',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAILURE: 'FETCH_FAILURE',
  RESET_ENTITY: 'RESET_ENTITY',
  DELETE_ENTITY: 'DELETE_ENTITY'
};