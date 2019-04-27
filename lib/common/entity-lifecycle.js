"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _entityConfiguration = _interopRequireDefault(require("./entity-configuration"));

var _actionCreators = _interopRequireDefault(require("../action-creators"));

var _entityConst = require("./entity-const");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EntityLifecycle(entityName, options) {
  if (!entityName) throw new Error('Missing required entity name');
  this.entityName = entityName;
  this.config = new _entityConfiguration.default(options || {});
  this.dispatch = null;
}

EntityLifecycle.prototype.getEntityName = function () {
  return this.entityName;
};

EntityLifecycle.prototype.setDispatch = function (dispatch) {
  if (typeof dispatch !== 'function') throw new Error('dispatch must be a function');
  this.dispatch = dispatch;
};

EntityLifecycle.prototype.setGetState = function (getState) {
  if (typeof getState !== 'function') throw new Error('getState must be a function');
  this.getState = getState;
};

EntityLifecycle.prototype.getDispatch = function () {
  if (!this.dispatch) throw new Error('Missing required dispatch function');
  return this.dispatch;
};

EntityLifecycle.prototype.onLoad = function () {
  if (!this.config.isSilent()) {
    this.getDispatch()(_actionCreators.default.fetchRequest(this.getEntityName())());
  }
};

EntityLifecycle.prototype.onSuccess = function (data) {
  var dispatchedData = this.runBeforeSuccess(data);
  this.dispatchFetchSuccess(dispatchedData);
  this.runAfterSuccess(dispatchedData);
  return dispatchedData;
};

EntityLifecycle.prototype.onFailure = function (error) {
  var dispatchedError = this.runBeforeFailure(error);
  this.dispatchFetchFailure(dispatchedError);
  this.runAfterFailure(dispatchedError);
  return dispatchedError;
};

EntityLifecycle.prototype.runBeforeSuccess = function (data) {
  return this.processStage(_entityConst.PROCESSOR_STAGE.BEFORE_SUCCESS, data);
};

EntityLifecycle.prototype.runAfterSuccess = function (data) {
  return this.processStage(_entityConst.PROCESSOR_STAGE.AFTER_SUCCESS, data);
};

EntityLifecycle.prototype.runBeforeFailure = function (error) {
  return this.processStage(_entityConst.PROCESSOR_STAGE.BEFORE_FAILURE, error);
};

EntityLifecycle.prototype.runAfterFailure = function (error) {
  return this.processStage(_entityConst.PROCESSOR_STAGE.AFTER_FAILURE, error);
};

EntityLifecycle.prototype.dispatchFetchSuccess = function (data) {
  this.dispatch(_actionCreators.default.fetchSuccess(this.getEntityName())(data, Date.now(), this.config.doAppend()));
};

EntityLifecycle.prototype.dispatchFetchFailure = function (error) {
  this.dispatch(_actionCreators.default.fetchFailure(this.getEntityName())(error, Date.now()));
};

EntityLifecycle.prototype.processStage = function (stage, data) {
  if (!stage) throw new Error('Missing required process stage');
  var processor = this.config.getProcessors()[stage];

  if (processor) {
    if (typeof processor !== 'function') throw new Error('processor must be a function');
    return processor(this.dispatch, this.getState, data);
  }

  return data;
};

var _default = EntityLifecycle;
exports.default = _default;