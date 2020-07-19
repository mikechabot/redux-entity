'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.OptionKey = exports.PayloadKeys = exports.ProcessorType = exports.EntityActionType = void 0;
var EntityActionType;
(function (EntityActionType) {
  /** Fetching the entity */
  EntityActionType['Request'] = 'FETCH_REQUEST';
  /** Promise has resolved */
  EntityActionType['Success'] = 'FETCH_SUCCESS';
  /** Promise has failed */
  EntityActionType['Failure'] = 'FETCH_FAILURE';
  /** Entity reset to initial state */
  EntityActionType['Reset'] = 'RESET_ENTITY';
  /** Entity removed from redux-entity state */
  EntityActionType['Delete'] = 'DELETE_ENTITY';
})((EntityActionType = exports.EntityActionType || (exports.EntityActionType = {})));
var ProcessorType;
(function (ProcessorType) {
  /** Executed if the promise resolves, but before "FETCH_SUCCESS" is dispatched */
  ProcessorType['BeforeSuccess'] = 'beforeSuccess';
  /** Executed if the promise resolves, but after "FETCH_SUCCESS" is dispatched */
  ProcessorType['AfterSuccess'] = 'afterSuccess';
  /** Executed if the promise rejects, but before "FETCH_FAILURE" is dispatched */
  ProcessorType['BeforeFailure'] = 'beforeFailure';
  /** Executed if the promise rejects, but after "FETCH_FAILURE" is dispatched */
  ProcessorType['AfterFailure'] = 'afterFailure';
})((ProcessorType = exports.ProcessorType || (exports.ProcessorType = {})));
var PayloadKeys;
(function (PayloadKeys) {
  PayloadKeys['Data'] = 'data';
  PayloadKeys['Error'] = 'error';
  PayloadKeys['LastUpdated'] = 'lastUpdated';
  PayloadKeys['Append'] = 'append';
})((PayloadKeys = exports.PayloadKeys || (exports.PayloadKeys = {})));
var OptionKey;
(function (OptionKey) {
  OptionKey['Silent'] = 'silent';
  OptionKey['Append'] = 'append';
  OptionKey['Processors'] = 'processors';
})((OptionKey = exports.OptionKey || (exports.OptionKey = {})));
