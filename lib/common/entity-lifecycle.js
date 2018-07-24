'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _entityConfiguration = require('./entity-configuration');

var _entityConfiguration2 = _interopRequireDefault(_entityConfiguration);

var _actionCreators = require('../action-creators');

var _actionCreators2 = _interopRequireDefault(_actionCreators);

var _entityConst = require('./entity-const');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function EntityLifecycle(entityName, options) {
  if (!entityName) throw new Error('Missing required entity name');
  this.entityName = entityName;
  this.config = new _entityConfiguration2.default(options || {});
  this.dispatch = null;
}

EntityLifecycle.prototype.getEntityName = function () {
  return this.entityName;
};

EntityLifecycle.prototype.setDispatch = function (dispatch) {
  if (typeof dispatch !== 'function') throw new Error('dispatch must be a function');
  this.dispatch = dispatch;
};

EntityLifecycle.prototype.getDispatch = function () {
  if (!this.dispatch) throw new Error('Missing required dispatch function');
  return this.dispatch;
};

EntityLifecycle.prototype.onLoad = function () {
  if (!this.config.isSilent()) {
    this.getDispatch()(_actionCreators2.default.fetchRequest(this.getEntityName())());
  }
};

EntityLifecycle.prototype.onSuccess = function (data) {
  this.runBeforeSuccess(data);
  this.dispatchFetchSuccess(data);
  this.runAfterSuccess(data);
};

EntityLifecycle.prototype.onFailure = function (error) {
  this.runBeforeFailure(error);
  this.dispatchFetchFailure(error);
  this.runAfterFailure(error);
};

EntityLifecycle.prototype.runBeforeSuccess = function (data) {
  this.processStage(_entityConst.PROCESSOR_STAGE.BEFORE_SUCCESS, data);
};

EntityLifecycle.prototype.runAfterSuccess = function (data) {
  this.processStage(_entityConst.PROCESSOR_STAGE.AFTER_SUCCESS, data);
};

EntityLifecycle.prototype.runBeforeFailure = function (error) {
  this.processStage(_entityConst.PROCESSOR_STAGE.BEFORE_FAILURE, error);
};

EntityLifecycle.prototype.runAfterFailure = function (error) {
  this.processStage(_entityConst.PROCESSOR_STAGE.AFTER_FAILURE, error);
};

EntityLifecycle.prototype.dispatchFetchSuccess = function (data) {
  this.dispatch(_actionCreators2.default.fetchSuccess(this.getEntityName())(data, Date.now(), this.config.doAppend()));
};

EntityLifecycle.prototype.dispatchFetchFailure = function (error) {
  this.dispatch(_actionCreators2.default.fetchFailure(this.getEntityName())(error, Date.now()));
};

EntityLifecycle.prototype.processStage = function (stage, obj) {
  if (!stage) throw new Error('Missing required process stage');
  var processor = this.config.getProcessors()[stage];
  if (processor) {
    if (typeof processor !== 'function') throw new Error('processor must be a function');
    processor(this.dispatch, obj);
  }
};

exports.default = EntityLifecycle;