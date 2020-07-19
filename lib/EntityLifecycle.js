'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var actions_1 = require('./actions');
var types_1 = require('./types');
var EntityLifecycle = /** @class */ (function () {
  function EntityLifecycle(_a) {
    var entityName = _a.entityName,
      options = _a.options;
    this.entityName = entityName;
    this.append = (options === null || options === void 0 ? void 0 : options.append) || false;
    this.silent = (options === null || options === void 0 ? void 0 : options.silent) || false;
    this.processors = (options === null || options === void 0 ? void 0 : options.processors) || {};
  }
  /**
   * Execute if the promise resolves
   * @param data
   * @param dispatch
   * @param getState
   */
  EntityLifecycle.prototype.onSuccess = function (data, dispatch, getState) {
    /**
     * Process the "beforeSuccess" stage, which is able to mutate the response
     * from the promise, dispatch additional actions, or getState(), before
     * dispatching the success message
     */
    var dispatchedData = this.processStage(types_1.ProcessorType.BeforeSuccess, data, dispatch, getState);
    /**
     * Create and dispatch the success action
     */
    var successAction = actions_1.fetchSuccessCreator(this.entityName);
    dispatch(successAction(dispatchedData, Date.now(), this.append));
    /**
     * Process the "afterSuccess" stage, which is invoked after the success
     * action has been dispatched.
     */
    this.processStage(types_1.ProcessorType.AfterSuccess, dispatchedData, dispatch, getState);
    /**
     * Return the mutated data
     */
    return dispatchedData;
  };
  /**
   * Execute if the promise rejects
   * @param error
   * @param dispatch
   * @param getState
   */
  EntityLifecycle.prototype.onFailure = function (error, dispatch, getState) {
    /**
     * Process the "beforeFailure" stage, which is able to mutate the response
     * from the promise, dispatch additional actions, or getState(), before
     * dispatching the error message
     */
    var dispatchedError = this.processStage(types_1.ProcessorType.BeforeFailure, error, dispatch, getState);
    /**
     * Create and dispatch the failure action
     */
    var failureAction = actions_1.fetchFailureCreator(this.entityName);
    dispatch(failureAction(dispatchedError, Date.now()));
    /**
     * Process the "afterFailure" stage, which is invoked after the failure
     * action has been dispatched.
     */
    this.processStage(types_1.ProcessorType.AfterFailure, dispatchedError, dispatch, getState);
    return dispatchedError;
  };
  /**
   * Process a stage of a given type
   * @param processorType
   * @param data
   * @param dispatch
   * @param getState
   */
  EntityLifecycle.prototype.processStage = function (processorType, data, dispatch, getState) {
    if (!processorType) {
      throw new Error('Missing required processorType');
    }
    /**
     * If the processor exists, execute it, and returned
     * the processed data.
     */
    var processor = this.processors[processorType];
    if (processor && typeof processor === 'function') {
      return processor(data, dispatch, getState);
    }
    return data;
  };
  return EntityLifecycle;
})();
exports.default = EntityLifecycle;
