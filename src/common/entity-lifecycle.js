import EntityConfiguration from './entity-configuration';
import actionCreators from '../action-creators';
import { PROCESSOR_STAGE } from './entity-const';

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
  this.processStage(PROCESSOR_STAGE.BEFORE_SUCCESS, data);
};

EntityLifecycle.prototype.runAfterSuccess = function (data) {
  this.processStage(PROCESSOR_STAGE.AFTER_SUCCESS, data);
};

EntityLifecycle.prototype.runBeforeFailure = function (error) {
  this.processStage(PROCESSOR_STAGE.BEFORE_FAILURE, error);
};

EntityLifecycle.prototype.runAfterFailure = function (error) {
  this.processStage(PROCESSOR_STAGE.AFTER_FAILURE, error);
};

EntityLifecycle.prototype.dispatchFetchSuccess = function (data) {
  this.dispatch(
    actionCreators.fetchSuccess(this.getEntityName())(data, Date.now(), this.config.doAppend())
  );
};

EntityLifecycle.prototype.dispatchFetchFailure = function (error) {
  this.dispatch(
    actionCreators.fetchFailure(this.getEntityName())(error, Date.now())
  );
};

EntityLifecycle.prototype.processStage = function (stage, obj) {
  if (!stage) throw new Error('Missing required process stage');
  const processor = this.config.getProcessors()[stage];
  if (processor) {
    if (typeof processor !== 'function') throw new Error('processor must be a function');
    processor(this.dispatch, obj);
  }
};

export default EntityLifecycle;
