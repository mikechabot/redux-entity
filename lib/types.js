'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.OptionKey = exports.PayloadKey = exports.ProcessorType = exports.EntityActionType = void 0;
var EntityActionType;
exports.EntityActionType = EntityActionType;

(function (EntityActionType) {
  EntityActionType['REQUEST'] = 'FETCH_REQUEST';
  EntityActionType['SUCCESS'] = 'FETCH_SUCCESS';
  EntityActionType['FAILURE'] = 'FETCH_FAILURE';
  EntityActionType['RESET'] = 'RESET_ENTITY';
  EntityActionType['DELETE'] = 'DELETE_ENTITY';
})(EntityActionType || (exports.EntityActionType = EntityActionType = {}));

var ProcessorType;
exports.ProcessorType = ProcessorType;

(function (ProcessorType) {
  ProcessorType['BEFORE_SUCCESS'] = 'beforeSuccess';
  ProcessorType['AFTER_SUCCESS'] = 'afterSuccess';
  ProcessorType['BEFORE_FAILURE'] = 'beforeFailure';
  ProcessorType['AFTER_FAILURE'] = 'afterFailure';
})(ProcessorType || (exports.ProcessorType = ProcessorType = {}));

var PayloadKey;
exports.PayloadKey = PayloadKey;

(function (PayloadKey) {
  PayloadKey['DATA'] = 'data';
  PayloadKey['ERROR'] = 'error';
  PayloadKey['LAST_UPDATED'] = 'lastUpdated';
  PayloadKey['APPEND'] = 'append';
})(PayloadKey || (exports.PayloadKey = PayloadKey = {}));

var OptionKey;
exports.OptionKey = OptionKey;

(function (OptionKey) {
  OptionKey['SILENT'] = 'silent';
  OptionKey['APPEND'] = 'append';
  OptionKey['PROCESSORS'] = 'processors';
})(OptionKey || (exports.OptionKey = OptionKey = {}));
