'use strict';

var actionCreators = require('./../action-creators');
var EntityConfiguration = require('./entity-configuration');

var _require = require('./entity-const'),
    PROCESSOR_STAGE = _require.PROCESSOR_STAGE;

function EntityLifecycle(entityName, options) {
    if (!entityName) throw new Error('Missing required entity name');
    this.entityName = entityName;
    this.config = new EntityConfiguration(options || {});
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
        this.getDispatch()(actionCreators.fetchRequest(this.getEntityName())());
    }
};

EntityLifecycle.prototype.onSuccess = function (data) {
    this._runBeforeSuccess(data);
    this._dispatchFetchSuccess(data);
    this._runAfterSuccess(data);
};

EntityLifecycle.prototype.onFailure = function (error) {
    this._runBeforeFailure(error);
    this._dispatchFetchFailure(error);
    this._runAfterFailure(error);
};

EntityLifecycle.prototype._runBeforeSuccess = function (data) {
    this.__processStage(PROCESSOR_STAGE.BEFORE_SUCCESS, data);
};

EntityLifecycle.prototype._runAfterSuccess = function (data) {
    this.__processStage(PROCESSOR_STAGE.AFTER_SUCCESS, data);
};

EntityLifecycle.prototype._runBeforeFailure = function (error) {
    this.__processStage(PROCESSOR_STAGE.BEFORE_FAILURE, error);
};

EntityLifecycle.prototype._runAfterFailure = function (error) {
    this.__processStage(PROCESSOR_STAGE.AFTER_FAILURE, error);
};

EntityLifecycle.prototype._dispatchFetchSuccess = function (data) {
    this.dispatch(actionCreators.fetchSuccess(this.getEntityName())(data, Date.now(), this.config.doAppend()));
};

EntityLifecycle.prototype._dispatchFetchFailure = function (error) {
    this.dispatch(actionCreators.fetchFailure(this.getEntityName())(error, Date.now()));
};

EntityLifecycle.prototype.__processStage = function (stage, obj) {
    if (!stage) throw new Error('Missing required process stage');
    var processor = this.config.getProcessors()[stage];
    if (processor) {
        if (typeof processor !== 'function') throw new Error('processor must be a function');
        processor(this.dispatch, obj);
    }
};

module.exports = EntityLifecycle;