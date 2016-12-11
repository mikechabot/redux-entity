
const Configuration = require('./configuration');
const actionCreators = require('../action-creators');
const STAGES = require('./const').STAGES;

function Lifecycle (dispatch, name, options) {
    this.dispatch = dispatch;
    this.name = name;
    this.config = new Configuration(options);
}

Lifecycle.prototype.getName = function () {
    return this.name;
};

Lifecycle.prototype.fetchRequest = function () {
    if (!this.config.isSilent()) {
        this.dispatch(
            actionCreators.fetchRequest(this.getName())()
        );
    }
};

Lifecycle.prototype.fetchSuccess = function (data) {
    this.dispatch(
        actionCreators.fetchSuccess(this.getName())(data, __now(), this.config.doAppend())
    );
};

Lifecycle.prototype.fetchFailure = function (error) {
    this.dispatch(
        actionCreators.fetchFailure(this.getName())(error, __now())
    );
};

Lifecycle.prototype.beforeSuccess = function (data) {
    this.__processStage(STAGES.BEFORE_SUCCESS, data);
};

Lifecycle.prototype.afterSucces = function (data) {
    this.__processStage(STAGES.AFTER_SUCCESS, data);
};

Lifecycle.prototype.beforeFailure = function (error) {
    this.__processStage(STAGES.BEFORE_FAILURE, error);
};

Lifecycle.prototype.afterFailure = function (error) {
    this.__processStage(STAGES.AFTER_FAILURE, error);
};

Lifecycle.prototype.__processStage = function (stage, obj) {
    const processor = this.config.getProcessors()[stage];
    if (processor) {
        if (typeof processor !== 'function') throw new Error('processor must be a function');
        processor(this.dispatch, obj);
    }
};

function __now () {
    return Date.now();
}

module.exports = Lifecycle;
