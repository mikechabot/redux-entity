'use strict';

var actionCreators = require('./../action-creators');
var EntityConfiguration = require('./entity-configuration');

var _require = require('./entity-const'),
    STAGES = _require.STAGES;

function __now() {
    return Date.now();
}

function EntityLifecycle(dispatch, name, options) {
    this.dispatch = dispatch;
    this.name = name;
    this.config = new EntityConfiguration(options);
}

EntityLifecycle.prototype.getName = function () {
    return this.name;
};

EntityLifecycle.prototype.fetchRequest = function () {
    if (!this.config.isSilent()) {
        this.dispatch(actionCreators.fetchRequest(this.getName())());
    }
};

EntityLifecycle.prototype.fetchSuccess = function (data) {
    this.dispatch(actionCreators.fetchSuccess(this.getName())(data, __now(), this.config.doAppend()));
};

EntityLifecycle.prototype.fetchFailure = function (error) {
    this.dispatch(actionCreators.fetchFailure(this.getName())(error, __now()));
};

EntityLifecycle.prototype.beforeSuccess = function (data) {
    this.__processStage(STAGES.BEFORE_SUCCESS, data);
};

EntityLifecycle.prototype.afterSuccess = function (data) {
    this.__processStage(STAGES.AFTER_SUCCESS, data);
};

EntityLifecycle.prototype.beforeFailure = function (error) {
    this.__processStage(STAGES.BEFORE_FAILURE, error);
};

EntityLifecycle.prototype.afterFailure = function (error) {
    this.__processStage(STAGES.AFTER_FAILURE, error);
};

EntityLifecycle.prototype.__processStage = function (stage, obj) {
    var processor = this.config.getProcessors()[stage];
    if (processor) {
        if (typeof processor !== 'function') throw new Error('processor must be a function');
        processor(this.dispatch, obj);
    }
};

module.exports = EntityLifecycle;