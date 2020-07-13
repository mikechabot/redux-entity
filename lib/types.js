'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.OptionKey = exports.PayloadKey = exports.ProcessorType = exports.EntityActionType = void 0;
var EntityActionType;
exports.EntityActionType = EntityActionType;

(function (EntityActionType) {
  EntityActionType['Request'] = 'FETCH_REQUEST';
  EntityActionType['Success'] = 'FETCH_SUCCESS';
  EntityActionType['Failure'] = 'FETCH_FAILURE';
  EntityActionType['Reset'] = 'RESET_ENTITY';
  EntityActionType['Delete'] = 'DELETE_ENTITY';
})(EntityActionType || (exports.EntityActionType = EntityActionType = {}));

var ProcessorType;
exports.ProcessorType = ProcessorType;

(function (ProcessorType) {
  ProcessorType['BeforeSuccess'] = 'beforeSuccess';
  ProcessorType['AfterSuccess'] = 'afterSuccess';
  ProcessorType['BeforeFailure'] = 'beforeFailure';
  ProcessorType['AfterFailure'] = 'afterFailure';
})(ProcessorType || (exports.ProcessorType = ProcessorType = {}));

var PayloadKey;
exports.PayloadKey = PayloadKey;

(function (PayloadKey) {
  PayloadKey['Data'] = 'data';
  PayloadKey['Error'] = 'error';
  PayloadKey['LastUpdated'] = 'lastUpdated';
  PayloadKey['Append'] = 'append';
})(PayloadKey || (exports.PayloadKey = PayloadKey = {}));

var OptionKey;
exports.OptionKey = OptionKey;

(function (OptionKey) {
  OptionKey['Silent'] = 'silent';
  OptionKey['Append'] = 'append';
  OptionKey['Processors'] = 'processors';
})(OptionKey || (exports.OptionKey = OptionKey = {}));
