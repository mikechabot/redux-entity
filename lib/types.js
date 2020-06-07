'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.OptionKey = exports.PayloadKey = exports.ProcessorType = exports.ActionType = void 0;
var ActionType;
exports.ActionType = ActionType;

(function (ActionType) {
  ActionType['REQUEST'] = 'FETCH_REQUEST';
  ActionType['SUCCESS'] = 'FETCH_SUCCESS';
  ActionType['FAILURE'] = 'FETCH_FAILURE';
  ActionType['RESET'] = 'RESET_ENTITY';
  ActionType['DELETE'] = 'DELETE_ENTITY';
})(ActionType || (exports.ActionType = ActionType = {}));

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
